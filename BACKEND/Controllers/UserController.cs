

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using BACKEND.Models;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using System.Text.RegularExpressions;
namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public UserController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_configuration.GetConnectionString("InvAppCon"));
        }

        // ========================
        // GET ALL USERS
        // ========================
        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            string query = @"SELECT UserId, FullName, Email, RoleId FROM tbl_users";
            DataTable table = new();

            try
            {
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);

                await con.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();
                table.Load(reader);

                return Ok(table);
            }
            catch
            {
                return StatusCode(500, new { message = "Error retrieving all users." });
            }
        }

        // ========================
        // GET ROLES
        // ========================
        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles()
        {
            string query = "SELECT RoleId AS id, RoleName AS name FROM tbl_roles";
            DataTable table = new();

            try
            {
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);

                await con.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();
                table.Load(reader);

                var roles = table.AsEnumerable().Select(row => new
                {
                    id = row.Field<int>("id"),
                    name = row.Field<string>("name")
                });

                return Ok(roles);
            }
            catch
            {
                return StatusCode(500, new { message = "Error retrieving roles." });
            }
        }

        private (int? userId, string? email) GetCurrentUser()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity == null || !identity.IsAuthenticated)
                return (null, null);

            var userIdClaim = identity.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var emailClaim = identity.FindFirst(ClaimTypes.Name)?.Value; // or ClaimTypes.Email if you used that in JWT

            int? userId = null;
            if (int.TryParse(userIdClaim, out var parsedId))
            {
                userId = parsedId;
            }

            return (userId, emailClaim);
        }

        // ========================
        // UPDATE USER
        // ========================
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(
            int id,
            [FromBody] UserModel user
        )
        {
            // =========================
            // REQUIRED FIELDS
            // =========================
            if (
                string.IsNullOrWhiteSpace(user.FullName) ||
                string.IsNullOrWhiteSpace(user.Email)
            )
            {
                return BadRequest(new
                {
                    message = "FullName and Email are required."
                });
            }

            // =========================
            // CLEAN INPUTS
            // =========================
            user.FullName = user.FullName.Trim();
            user.Email = user.Email.Trim().ToLower();

            // =========================
            // EMAIL VALIDATION
            // =========================
            var emailRegex = new Regex(
                @"^[a-zA-Z0-9._%+-]+@up\.edu\.ph$",
                RegexOptions.IgnoreCase
            );

            if (!emailRegex.IsMatch(user.Email))
            {
                return BadRequest(new
                {
                    message = "Invalid UP email format."
                });
            }

            // =========================
            // SAFE ADMIN ROLES ONLY
            // =========================
            var allowedRoles = new List<int>
    {
        1, // Admin
        2, // Agent
        3, // Regular
        4,  // COS
        5, //SPMO
        6, // Student

    };

            int finalRoleId = allowedRoles.Contains(user.RoleId ?? 4)
                ? user.RoleId!.Value
                : 4;

            try
            {
                using var con = GetConnection();

                await con.OpenAsync();

                // =========================
                // CHECK DUPLICATE EMAIL
                // =========================
                string duplicateQuery = @"
            SELECT COUNT(*)
            FROM tbl_users
            WHERE Email = @Email
            AND UserId != @UserId";

                using (var duplicateCmd = new MySqlCommand(
                    duplicateQuery,
                    con
                ))
                {
                    duplicateCmd.Parameters.AddWithValue(
                        "@Email",
                        user.Email
                    );

                    duplicateCmd.Parameters.AddWithValue(
                        "@UserId",
                        id
                    );

                    int existing =
                        Convert.ToInt32(
                            await duplicateCmd.ExecuteScalarAsync()
                        );

                    if (existing > 0)
                    {
                        return BadRequest(new
                        {
                            message = "Email already exists."
                        });
                    }
                }

                // =========================
                // UPDATE USER
                // =========================
                string query = @"
            UPDATE tbl_users
            SET
                FullName = @FullName,
                Email = @Email,
                RoleId = @RoleId
            WHERE UserId = @UserId";

                using var cmd = new MySqlCommand(query, con);

                cmd.Parameters.AddWithValue(
                    "@FullName",
                    user.FullName
                );

                cmd.Parameters.AddWithValue(
                    "@Email",
                    user.Email
                );

                cmd.Parameters.AddWithValue(
                    "@RoleId",
                    finalRoleId
                );

                cmd.Parameters.AddWithValue(
                    "@UserId",
                    id
                );

                int rows =
                    await cmd.ExecuteNonQueryAsync();

                if (rows == 0)
                {
                    return NotFound(new
                    {
                        message = "User not found."
                    });
                }

                // =========================
                // AUDIT LOG
                // =========================
                var (currentUserId, currentUserEmail) =
                    GetCurrentUser();

                await LogAudit(
                    currentUserId,
                    currentUserEmail,
                    "Update User",
                    $"Updated user #{id} | RoleId: {finalRoleId}"
                );

                return Ok(new
                {
                    message = "User updated successfully."
                });
            }
            catch
            {
                return StatusCode(500, new
                {
                    message = "Error updating user."
                });
            }
        }


        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("authToken");

            return Ok(new
            {
                message = "Logged out successfully"
            });
        }
        [Authorize]
        [HttpGet("validate")]
        public IActionResult Validate()
        {
            return Ok(new
            {
                authenticated = true
            });
        }

        //TODO: 08/04/2026 The user can login any email as long as it register to databases 
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginModel user)
        {
            if (string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.Password))
            {
                return BadRequest(new { message = "Email and Password are required." });
            }

            string query = @"
            SELECT u.UserId, u.FullName, u.Password, u.FailedAttempts, u.LockoutEnd, r.RoleName
            FROM tbl_users u
            JOIN tbl_roles r ON u.RoleId = r.RoleId
            WHERE u.Email = @Email";

            try
            {
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Email", user.Email);

                await con.OpenAsync();

                int userId = 0;
                string storedPassword = "";
                string fullName = "";
                string roleName = "";
                int failedAttempts = 0;
                DateTime? lockoutEnd = null;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (!await reader.ReadAsync())
                    {
                        return Unauthorized(new { message = "Invalid email or password." });
                    }

                    userId = Convert.ToInt32(reader["UserId"]);
                    storedPassword = reader["Password"]?.ToString() ?? "";
                    fullName = reader["FullName"]?.ToString() ?? "";
                    roleName = reader["RoleName"]?.ToString() ?? "";
                    failedAttempts = Convert.ToInt32(reader["FailedAttempts"]);

                    lockoutEnd = reader.IsDBNull(reader.GetOrdinal("LockoutEnd"))
                        ? null
                        : reader.GetDateTime("LockoutEnd");
                }

                // helper for consistent time formatting
                string FormatLocalTime(DateTime utcTime)
                {
                    return utcTime.ToLocalTime().ToString("MMMM dd, yyyy hh:mm tt");
                }

                // 🔒 ACTIVE LOCK CHECK
                if (lockoutEnd.HasValue)
                {
                    if (lockoutEnd.Value > DateTime.UtcNow)
                    {
                        return Unauthorized(new
                        {
                            message = $"Account locked. Please try again after {FormatLocalTime(lockoutEnd.Value)}"
                        });
                    }

                    // lock expired → reset
                    string resetLockSql = @"
                UPDATE tbl_users
                SET FailedAttempts = 0,
                    LockoutEnd = NULL
                WHERE UserId = @UserId";

                    using (var resetCmd = new MySqlCommand(resetLockSql, con))
                    {
                        resetCmd.Parameters.AddWithValue("@UserId", userId);
                        await resetCmd.ExecuteNonQueryAsync();
                    }

                    failedAttempts = 0;
                }

                // ✅ PASSWORD CORRECT
                if (BCrypt.Net.BCrypt.Verify(user.Password, storedPassword))
                {
                    string resetSql = @"
                UPDATE tbl_users 
                SET FailedAttempts = 0, LockoutEnd = NULL 
                WHERE UserId = @UserId";

                    using (var resetCmd = new MySqlCommand(resetSql, con))
                    {
                        resetCmd.Parameters.AddWithValue("@UserId", userId);
                        await resetCmd.ExecuteNonQueryAsync();
                    }

                    var token = GenerateJwt(userId, user.Email, fullName, roleName);

                    // return Ok(new { token, role = roleName, fullName });
                    Response.Cookies.Append("authToken", token, new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.None,
                        Expires = DateTime.UtcNow.AddHours(1)
                    });

                    return Ok(new
                    {
                        role = roleName,
                        fullName
                    });
                }

                // ❌ WRONG PASSWORD
                failedAttempts++;

                DateTime? newLockoutEnd = null;

                if (failedAttempts >= 5)
                {
                    newLockoutEnd = DateTime.UtcNow.AddMinutes(3);
                }

                string updateSql = @"
            UPDATE tbl_users 
            SET FailedAttempts = @Attempts, LockoutEnd = @LockoutEnd 
            WHERE UserId = @UserId";

                using (var updateCmd = new MySqlCommand(updateSql, con))
                {
                    updateCmd.Parameters.AddWithValue("@Attempts", failedAttempts);
                    updateCmd.Parameters.AddWithValue("@LockoutEnd", (object?)newLockoutEnd ?? DBNull.Value);
                    updateCmd.Parameters.AddWithValue("@UserId", userId);

                    await updateCmd.ExecuteNonQueryAsync();
                }

                // 🔒 LOCK RESPONSE (FIXED)
                if (newLockoutEnd.HasValue)
                {
                    return Unauthorized(new
                    {
                        message = $"Account locked. Please try again after {FormatLocalTime(newLockoutEnd.Value)}"
                    });
                }

                return Unauthorized(new
                {
                    message = $"Invalid email or password. Attempts left: {5 - failedAttempts}"
                });
            }
            catch
            {
                return StatusCode(500, new { message = "Login error." });
            }
        }

        //       //TODO: 08/04/2026 The user can login only up email
        //         [HttpPost("login")]
        // public async Task<IActionResult> Login([FromBody] UserLoginModel user)
        // {
        //     // 1. Validate required fields
        //     if (string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.Password))
        //     {
        //         return BadRequest(new { message = "Email and Password are required." });
        //     }

        //     // 2. Validate UP domain (@up.edu.ph)
        //     if (!user.Email.Trim().EndsWith("@up.edu.ph", StringComparison.OrdinalIgnoreCase))
        //     {
        //         return BadRequest(new { message = "Only @up.edu.ph email addresses are allowed." });
        //     }

        //     string query = @"
        //         SELECT u.UserId, u.FullName, u.Password, u.FailedAttempts, u.LockoutEnd, r.RoleName
        //         FROM tbl_users u
        //         JOIN tbl_roles r ON u.RoleId = r.RoleId
        //         WHERE u.Email = @Email";

        //     try
        //     {
        //         using var con = GetConnection();
        //         using var cmd = new MySqlCommand(query, con);
        //         cmd.Parameters.AddWithValue("@Email", user.Email.Trim());

        //         await con.OpenAsync();

        //         int userId = 0;
        //         string storedPassword = "";
        //         string fullName = "";
        //         string roleName = "";
        //         int failedAttempts = 0;
        //         DateTime? lockoutEnd = null;

        //         using (var reader = await cmd.ExecuteReaderAsync())
        //         {
        //             if (!await reader.ReadAsync())
        //             {
        //                 return Unauthorized(new { message = "Invalid email or password." });
        //             }

        //             userId = Convert.ToInt32(reader["UserId"]);
        //             storedPassword = reader["Password"]?.ToString() ?? "";
        //             fullName = reader["FullName"]?.ToString() ?? "";
        //             roleName = reader["RoleName"]?.ToString() ?? "";
        //             failedAttempts = Convert.ToInt32(reader["FailedAttempts"]);

        //             lockoutEnd = reader.IsDBNull(reader.GetOrdinal("LockoutEnd"))
        //                 ? null
        //                 : reader.GetDateTime("LockoutEnd");
        //         }

        //         // helper for consistent time formatting
        //         string FormatLocalTime(DateTime utcTime)
        //         {
        //             return utcTime.ToLocalTime().ToString("MMMM dd, yyyy hh:mm tt");
        //         }

        //         // 🔒 ACTIVE LOCK CHECK
        //         if (lockoutEnd.HasValue)
        //         {
        //             if (lockoutEnd.Value > DateTime.UtcNow)
        //             {
        //                 return Unauthorized(new
        //                 {
        //                     message = $"Account locked. Please try again after {FormatLocalTime(lockoutEnd.Value)}"
        //                 });
        //             }

        //             // lock expired → reset
        //             string resetLockSql = @"
        //                 UPDATE tbl_users
        //                 SET FailedAttempts = 0,
        //                     LockoutEnd = NULL
        //                 WHERE UserId = @UserId";

        //             using (var resetCmd = new MySqlCommand(resetLockSql, con))
        //             {
        //                 resetCmd.Parameters.AddWithValue("@UserId", userId);
        //                 await resetCmd.ExecuteNonQueryAsync();
        //             }

        //             failedAttempts = 0;
        //         }

        //         // ✅ PASSWORD CORRECT
        //         if (BCrypt.Net.BCrypt.Verify(user.Password, storedPassword))
        //         {
        //             string resetSql = @"
        //                 UPDATE tbl_users 
        //                 SET FailedAttempts = 0, LockoutEnd = NULL 
        //                 WHERE UserId = @UserId";

        //             using (var resetCmd = new MySqlCommand(resetSql, con))
        //             {
        //                 resetCmd.Parameters.AddWithValue("@UserId", userId);
        //                 await resetCmd.ExecuteNonQueryAsync();
        //             }

        //             var token = GenerateJwt(userId, user.Email, fullName, roleName);

        //             Response.Cookies.Append("authToken", token, new CookieOptions
        //             {
        //                 HttpOnly = true,
        //                 Secure = true,
        //                 SameSite = SameSiteMode.None,
        //                 Expires = DateTime.UtcNow.AddHours(1)
        //             });

        //             return Ok(new
        //             {
        //                 role = roleName,
        //                 fullName
        //             });
        //         }

        //         // ❌ WRONG PASSWORD
        //         failedAttempts++;

        //         DateTime? newLockoutEnd = null;

        //         if (failedAttempts >= 5)
        //         {
        //             newLockoutEnd = DateTime.UtcNow.AddMinutes(3);
        //         }

        //         string updateSql = @"
        //             UPDATE tbl_users 
        //             SET FailedAttempts = @Attempts, LockoutEnd = @LockoutEnd 
        //             WHERE UserId = @UserId";

        //         using (var updateCmd = new MySqlCommand(updateSql, con))
        //         {
        //             updateCmd.Parameters.AddWithValue("@Attempts", failedAttempts);
        //             updateCmd.Parameters.AddWithValue("@LockoutEnd", (object?)newLockoutEnd ?? DBNull.Value);
        //             updateCmd.Parameters.AddWithValue("@UserId", userId);

        //             await updateCmd.ExecuteNonQueryAsync();
        //         }

        //         // 🔒 LOCK RESPONSE
        //         if (newLockoutEnd.HasValue)
        //         {
        //             return Unauthorized(new
        //             {
        //                 message = $"Account locked. Please try again after {FormatLocalTime(newLockoutEnd.Value)}"
        //             });
        //         }

        //         return Unauthorized(new
        //         {
        //             message = $"Invalid email or password. Attempts left: {5 - failedAttempts}"
        //         });
        //     }
        //     catch
        //     {
        //         return StatusCode(500, new { message = "Login error." });
        //     }
        // }


        private string GenerateJwt(int userId, string email, string fullName, string role)
        {
            var claims = new[]
            {
        new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
        new Claim(ClaimTypes.Name, email),
        new Claim("FullName", fullName),
        new Claim(ClaimTypes.Role, role),

        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"] ?? "")
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

        // ========================
        // DELETE USER
        // ========================
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            string query = "DELETE FROM tbl_users WHERE UserId = @UserId";

            try
            {
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);

                cmd.Parameters.Add("@UserId", MySqlDbType.Int32).Value = id;

                await con.OpenAsync();
                int rows = await cmd.ExecuteNonQueryAsync();

                if (rows > 0)
                    return Ok(new { message = "User deleted successfully." });

                return NotFound(new { message = "User not found." });
            }
            catch
            {
                return StatusCode(500, new { message = "Error deleting user." });
            }
        }

        [HttpGet("agents")]
        public async Task<IActionResult> GetAgents()
        {
            string query = @"SELECT Email 
                     FROM tbl_users u
                     JOIN tbl_roles r ON u.RoleId = r.RoleId
                     WHERE r.RoleName = 'Agent' OR r.RoleName = 'IT Support'";

            List<string> agents = new();

            try
            {
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);

                await con.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    agents.Add(reader["Email"]?.ToString() ?? "");
                }

                return Ok(agents);
            }
            catch
            {
                return StatusCode(500, new { message = "Error retrieving agents." });
            }
        }


        [HttpGet("zoom-recipients")]
        public async Task<IActionResult> GetZoomRecipients()
        {
            string query = @"SELECT Email
                     FROM tbl_users u
                     JOIN tbl_roles r ON u.RoleId = r.RoleId
                     WHERE r.RoleName IN ('Agent','Admin')";

            List<string> recipients = new();

            try
            {
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);

                await con.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    recipients.Add(reader["Email"]?.ToString() ?? "");
                }

                return Ok(recipients);
            }
            catch
            {
                return StatusCode(500, new { message = "Error retrieving zoom recipients." });
            }
        }
        // ========================
        // CHECK EMAIL
        // ========================
        [HttpPost("check-email")]
        public async Task<IActionResult> CheckEmail([FromBody] EmailRequestModel request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { message = "Email is required." });
            }

            string query = "SELECT RoleId FROM tbl_users WHERE Email = @Email";
            try
            {
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);
                cmd.Parameters.Add("@Email", MySqlDbType.VarChar).Value = request.Email;

                await con.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    int roleId = Convert.ToInt32(reader["RoleId"]);
                    return Ok(new { message = "Request processed." });
                }

                return Ok(new { exists = false });
            }
            catch
            {
                return StatusCode(500, new { message = "Error checking email." });
            }
        }

        // ========================
        // HELPER: Log Audit Trail
        // ========================
        private async Task LogAudit(int? userId, string email, string action, string details)
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
                // ⚠️ Ignore logging errors (do not break main logic)
            }
        }
    }
}
