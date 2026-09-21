

//TODO:08/04/2026 The user can login ANY email
// Google Sign on any email

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BACKEND.Models;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MySql.Data.MySqlClient;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoogleLoginController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public GoogleLoginController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_configuration.GetConnectionString("InvAppCon"));
        }

        // ========================
        // GET GOOGLE CLIENT ID
        // ========================
        [HttpGet("google-client-id")]
        public async Task<IActionResult> GetGoogleClientId()
        {
            string query = "SELECT SettingValue FROM tbl_googlelogin WHERE SettingKey = 'google_client_id' LIMIT 1";

            try
            {
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);

                await con.OpenAsync();
                var result = await cmd.ExecuteScalarAsync();

                if (result == null)
                    return NotFound(new { message = "Google Client ID not found." });

                return Ok(new { clientId = result.ToString() });
            }
            catch
            {
                return StatusCode(500, new { message = "Error retrieving Google Client ID." });
            }
        }


        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token);
                string email = payload.Email;

                string query = @"
            SELECT u.UserId, u.FullName, u.FailedAttempts, u.LockoutEnd, r.RoleName
            FROM tbl_users u
            JOIN tbl_roles r ON u.RoleId = r.RoleId
            WHERE u.Email = @Email";

                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Email", email);

                await con.OpenAsync();

                int userId;
                string fullName;
                string roleName;
                int failedAttempts;
                DateTime? lockoutEnd;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (!await reader.ReadAsync())
                    {
                        await LogAudit(null, email, "GoogleLoginFailed", "Not registered Google account");

                        return Unauthorized(new
                        {
                            code = "NOT_REGISTERED",
                            message = "Google account not registered."
                        });
                    }

                    userId = Convert.ToInt32(reader["UserId"]);
                    fullName = reader["FullName"]?.ToString() ?? "";
                    roleName = reader["RoleName"]?.ToString() ?? "";
                    failedAttempts = Convert.ToInt32(reader["FailedAttempts"]);

                    int lockoutIndex = reader.GetOrdinal("LockoutEnd");
                    lockoutEnd = reader.IsDBNull(lockoutIndex)
                        ? null
                        : reader.GetDateTime(lockoutIndex);
                }

                // 🔒 LOCK CHECK
                if (lockoutEnd.HasValue && lockoutEnd.Value > DateTime.UtcNow)
                {
                    return Unauthorized(new
                    {
                        code = "LOCKED",
                        message = $"Account locked until {lockoutEnd.Value.ToLocalTime():MMMM dd, yyyy hh:mm tt}"
                    });
                }

                // 🔓 RESET LOCK IF EXPIRED
                string resetSql = @"
            UPDATE tbl_users 
            SET FailedAttempts = 0, LockoutEnd = NULL 
            WHERE UserId = @UserId";

                using (var resetCmd = new MySqlCommand(resetSql, con))
                {
                    resetCmd.Parameters.AddWithValue("@UserId", userId);
                    await resetCmd.ExecuteNonQueryAsync();
                }

                var token = GenerateJwt(userId, email, fullName, roleName);

                Response.Cookies.Append("authToken", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddHours(1)
                });

                await LogAudit(userId, email, "GoogleLoginSuccess", "Login successful");

                return Ok(new
                {
                    email,
                    fullName,
                    role = roleName
                });
            }
            catch
            {
                await LogAudit(null, null, "GoogleLoginFailed", "Invalid Google token");

                return Unauthorized(new
                {
                    code = "INVALID_TOKEN",
                    message = "Invalid Google token."
                });
            }
        }

        private string GenerateJwt(int userId, string email, string fullName, string role)
        {
            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, email),
            new Claim("FullName", fullName),
            new Claim(ClaimTypes.Role, role)
        };

            var secretKey = _configuration["JwtSettings:SecretKey"]
         ?? throw new InvalidOperationException("JwtSettings:SecretKey is missing from configuration.");

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(secretKey)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    Convert.ToDouble(_configuration["JwtSettings:ExpirationMinutes"])
                ),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool IsLocked(DateTime? lockoutEnd)
        {
            return lockoutEnd.HasValue && lockoutEnd.Value > DateTime.UtcNow;
        }

        private async Task IncrementFailedAttempts(string email)
        {
            using var con = GetConnection();

            string sql = @"
        UPDATE tbl_users 
        SET FailedAttempts = FailedAttempts + 1
        WHERE Email = @Email;

        UPDATE tbl_users 
        SET LockoutEnd = DATE_ADD(NOW(), INTERVAL 3 MINUTE)
        WHERE Email = @Email AND FailedAttempts + 1 >= 5;
    ";

            using var cmd = new MySqlCommand(sql, con);
            cmd.Parameters.AddWithValue("@Email", email);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }
        [HttpPut("update-google-client-id")]
        public async Task<IActionResult> UpdateGoogleClientId([FromBody] dynamic data)
        {
            string query = @"UPDATE tbl_googlelogin 
                                SET SettingValue=@clientId
                                WHERE SettingKey='google_client_id'";

            try
            {
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);

                cmd.Parameters.AddWithValue("@clientId", data.clientId.ToString());

                await con.OpenAsync();
                await cmd.ExecuteNonQueryAsync();

                // ✅ Log client ID update
                await LogAudit(null, "System", "UpdateGoogleClientID", $"Updated Google Client ID to: {data.clientId}");

                return Ok(new { message = "Google Client ID updated successfully" });
            }
            catch
            {
                return StatusCode(500, new { message = "Error updating Google Client ID" });
            }
        }

        // ========================
        // HELPER: Log Audit Trail
        // ========================
        private async Task LogAudit(int? userId, string? email, string action, string details)
        {
            string query = @"INSERT INTO log_user (UserId, Email, Action, Details) 
                                VALUES (@UserId, @Email, @Action, @Details)";

            try
            {
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);

                cmd.Parameters.Add("@UserId", MySqlDbType.Int32).Value = userId ?? (object)DBNull.Value;
                cmd.Parameters.Add("@Email", MySqlDbType.VarChar).Value = email ?? "Unknown";
                cmd.Parameters.Add("@Action", MySqlDbType.VarChar).Value = action;
                cmd.Parameters.Add("@Details", MySqlDbType.Text).Value = details;

                await con.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
            catch
            {
                // ⚠️ Ignore logging errors
            }
        }
    }
}



//TODO: //08/04/2026 The user can login only up email
// using System;
// using System.Collections.Generic;
// using System.IdentityModel.Tokens.Jwt;
// using System.Linq;
// using System.Security.Claims;
// using System.Text;
// using System.Threading.Tasks;
// using BACKEND.Models;
// using Google.Apis.Auth;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.IdentityModel.Tokens;
// using MySql.Data.MySqlClient;

// namespace BACKEND.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class GoogleLoginController : ControllerBase
//     {
//         private readonly IConfiguration _configuration;

//         public GoogleLoginController(IConfiguration configuration)
//         {
//             _configuration = configuration;
//         }

//         private MySqlConnection GetConnection()
//         {
//             return new MySqlConnection(_configuration.GetConnectionString("InvAppCon"));
//         }

//         // ========================
//         // GET GOOGLE CLIENT ID
//         // ========================
//         [HttpGet("google-client-id")]
//         public async Task<IActionResult> GetGoogleClientId()
//         {
//             string query = "SELECT SettingValue FROM tbl_googlelogin WHERE SettingKey = 'google_client_id' LIMIT 1";

//             try
//             {
//                 using var con = GetConnection();
//                 using var cmd = new MySqlCommand(query, con);

//                 await con.OpenAsync();
//                 var result = await cmd.ExecuteScalarAsync();

//                 if (result == null)
//                     return NotFound(new { message = "Google Client ID not found." });

//                 return Ok(new { clientId = result.ToString() });
//             }
//             catch
//             {
//                 return StatusCode(500, new { message = "Error retrieving Google Client ID." });
//             }
//         }


//         [HttpPost("google-login")]
//         public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
//         {
//             try
//             {
//                 var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token);
//                 string email = payload.Email?.Trim() ?? "";

//                 // 🔒 DOMAIN VALIDATION (@up.edu.ph)
//                 if (!email.EndsWith("@up.edu.ph", StringComparison.OrdinalIgnoreCase))
//                 {
//                     await LogAudit(null, email, "GoogleLoginFailed", "Unauthorized domain attempt");

//                     return BadRequest(new
//                     {
//                         code = "INVALID_DOMAIN",
//                         message = "Only @up.edu.ph email addresses are allowed."
//                     });
//                 }

//                 string query = @"
//                     SELECT u.UserId, u.FullName, u.FailedAttempts, u.LockoutEnd, r.RoleName
//                     FROM tbl_users u
//                     JOIN tbl_roles r ON u.RoleId = r.RoleId
//                     WHERE u.Email = @Email";

//                 using var con = GetConnection();
//                 using var cmd = new MySqlCommand(query, con);
//                 cmd.Parameters.AddWithValue("@Email", email);

//                 await con.OpenAsync();

//                 int userId;
//                 string fullName;
//                 string roleName;
//                 int failedAttempts;
//                 DateTime? lockoutEnd;

//                 using (var reader = await cmd.ExecuteReaderAsync())
//                 {
//                     if (!await reader.ReadAsync())
//                     {
//                         await LogAudit(null, email, "GoogleLoginFailed", "Not registered Google account");

//                         return Unauthorized(new
//                         {
//                             code = "NOT_REGISTERED",
//                             message = "Google account not registered."
//                         });
//                     }

//                     userId = Convert.ToInt32(reader["UserId"]);
//                     fullName = reader["FullName"]?.ToString() ?? "";
//                     roleName = reader["RoleName"]?.ToString() ?? "";
//                     failedAttempts = Convert.ToInt32(reader["FailedAttempts"]);

//                     int lockoutIndex = reader.GetOrdinal("LockoutEnd");
//                     lockoutEnd = reader.IsDBNull(lockoutIndex)
//                         ? null
//                         : reader.GetDateTime(lockoutIndex);
//                 }

//                 // 🔒 LOCK CHECK
//                 if (lockoutEnd.HasValue && lockoutEnd.Value > DateTime.UtcNow)
//                 {
//                     return Unauthorized(new
//                     {
//                         code = "LOCKED",
//                         message = $"Account locked until {lockoutEnd.Value.ToLocalTime():MMMM dd, yyyy hh:mm tt}"
//                     });
//                 }

//                 // 🔓 RESET LOCK IF EXPIRED
//                 string resetSql = @"
//                     UPDATE tbl_users 
//                     SET FailedAttempts = 0, LockoutEnd = NULL 
//                     WHERE UserId = @UserId";

//                 using (var resetCmd = new MySqlCommand(resetSql, con))
//                 {
//                     resetCmd.Parameters.AddWithValue("@UserId", userId);
//                     await resetCmd.ExecuteNonQueryAsync();
//                 }

//                 var token = GenerateJwt(userId, email, fullName, roleName);

//                 Response.Cookies.Append("authToken", token, new CookieOptions
//                 {
//                     HttpOnly = true,
//                     Secure = true,
//                     SameSite = SameSiteMode.None,
//                     Expires = DateTime.UtcNow.AddHours(1)
//                 });

//                 await LogAudit(userId, email, "GoogleLoginSuccess", "Login successful");

//                 return Ok(new
//                 {
//                     email,
//                     fullName,
//                     role = roleName
//                 });
//             }
//             catch
//             {
//                 await LogAudit(null, null, "GoogleLoginFailed", "Invalid Google token");

//                 return Unauthorized(new
//                 {
//                     code = "INVALID_TOKEN",
//                     message = "Invalid Google token."
//                 });
//             }
//         }

//         private string GenerateJwt(int userId, string email, string fullName, string role)
//         {
//             var claims = new[]
//             {
//                 new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
//                 new Claim(ClaimTypes.Name, email),
//                 new Claim("FullName", fullName),
//                 new Claim(ClaimTypes.Role, role)
//             };

//             var key = new SymmetricSecurityKey(
//                 Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"])
//             );

//             var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//             var token = new JwtSecurityToken(
//                 issuer: _configuration["JwtSettings:Issuer"],
//                 audience: _configuration["JwtSettings:Audience"],
//                 claims: claims,
//                 expires: DateTime.UtcNow.AddMinutes(
//                     Convert.ToDouble(_configuration["JwtSettings:ExpirationMinutes"])
//                 ),
//                 signingCredentials: creds
//             );

//             return new JwtSecurityTokenHandler().WriteToken(token);
//         }

//         private bool IsLocked(DateTime? lockoutEnd)
//         {
//             return lockoutEnd.HasValue && lockoutEnd.Value > DateTime.UtcNow;
//         }

//         private async Task IncrementFailedAttempts(string email)
//         {
//             using var con = GetConnection();

//             string sql = @"
//                 UPDATE tbl_users 
//                 SET FailedAttempts = FailedAttempts + 1
//                 WHERE Email = @Email;

//                 UPDATE tbl_users 
//                 SET LockoutEnd = DATE_ADD(NOW(), INTERVAL 3 MINUTE)
//                 WHERE Email = @Email AND FailedAttempts + 1 >= 5;
//             ";

//             using var cmd = new MySqlCommand(sql, con);
//             cmd.Parameters.AddWithValue("@Email", email);

//             await con.OpenAsync();
//             await cmd.ExecuteNonQueryAsync();
//         }

//         [HttpPut("update-google-client-id")]
//         public async Task<IActionResult> UpdateGoogleClientId([FromBody] dynamic data)
//         {
//             string query = @"UPDATE tbl_googlelogin 
//                             SET SettingValue=@clientId
//                             WHERE SettingKey='google_client_id'";

//             try
//             {
//                 using var con = GetConnection();
//                 using var cmd = new MySqlCommand(query, con);

//                 cmd.Parameters.AddWithValue("@clientId", data.clientId.ToString());

//                 await con.OpenAsync();
//                 await cmd.ExecuteNonQueryAsync();

//                 // ✅ Log client ID update
//                 await LogAudit(null, "System", "UpdateGoogleClientID", $"Updated Google Client ID to: {data.clientId}");

//                 return Ok(new { message = "Google Client ID updated successfully" });
//             }
//             catch
//             {
//                 return StatusCode(500, new { message = "Error updating Google Client ID" });
//             }
//         }

//         // ========================
//         // HELPER: Log Audit Trail
//         // ========================
//         private async Task LogAudit(int? userId, string? email, string action, string details)
//         {
//             string query = @"INSERT INTO log_user (UserId, Email, Action, Details) 
//                             VALUES (@UserId, @Email, @Action, @Details)";

//             try
//             {
//                 using var con = GetConnection();
//                 using var cmd = new MySqlCommand(query, con);

//                 cmd.Parameters.Add("@UserId", MySqlDbType.Int32).Value = userId ?? (object)DBNull.Value;
//                 cmd.Parameters.Add("@Email", MySqlDbType.VarChar).Value = email ?? "Unknown";
//                 cmd.Parameters.Add("@Action", MySqlDbType.VarChar).Value = action;
//                 cmd.Parameters.Add("@Details", MySqlDbType.Text).Value = details;

//                 await con.OpenAsync();
//                 await cmd.ExecuteNonQueryAsync();
//             }
//             catch
//             {
//                 // ⚠️ Ignore logging errors
//             }
//         }
//     }
// }
