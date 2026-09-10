

using System;
using System.Threading.Tasks;
using BACKEND.Hubs;
using BACKEND.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MySql.Data.MySqlClient;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // 🔒 Enforce Admin role across ALL endpoints by default
    public class SmtpController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHubContext<NotificationHub> _hubContext;

        public SmtpController(IConfiguration configuration, IHubContext<NotificationHub> hubContext)
        {
            _configuration = configuration;
            _hubContext = hubContext;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_configuration.GetConnectionString("InvAppCon"));
        }

        // ========================
        // GET SMTP SETTINGS
        // ========================
        [HttpGet("smtp-settings")]
        public async Task<IActionResult> GetSmtpSettings()
        {
            string query = "SELECT server, port, sender_name, sender_email, username, enable_ssl FROM tbl_smtp_settings LIMIT 1";

            try
            {
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);

                await con.OpenAsync();
                using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    var smtp = new
                    {
                        server = reader["server"].ToString(),
                        port = Convert.ToInt32(reader["port"]),
                        senderName = reader["sender_name"].ToString(),
                        senderEmail = reader["sender_email"].ToString(),
                        username = reader["username"].ToString(),
                        password = "••••••••", // 🔒 NEVER expose the actual password back to the UI clients!
                        enableSsl = Convert.ToBoolean(reader["enable_ssl"])
                    };

                    return Ok(smtp);
                }

                return NotFound(new { message = "SMTP settings not found." });
            }
            catch (Exception)
            {
                // 🔒 Sanitized Exception: Do not return raw ex.Message to the client to avoid information disclosure
                return StatusCode(500, new { message = "Error retrieving SMTP settings securely." });
            }
        }

        // ========================
        // UPDATE SMTP SETTINGS
        // ========================
        [HttpPut("update-smtp")]
        public async Task<IActionResult> UpdateSmtp([FromBody] SmtpModel model)
        {
            // If password is sent as the placeholder mask, do not overwrite the existing password field with dots
            bool shouldUpdatePassword = !string.IsNullOrWhiteSpace(model.Password) && model.Password != "••••••••";

            string query = $@"UPDATE tbl_smtp_settings 
                             SET server = @server,
                                 port = @port,
                                 sender_name = @senderName,
                                 sender_email = @senderEmail,
                                 username = @username,
                                 {(shouldUpdatePassword ? "password = @password," : "")}
                                 enable_ssl = @enableSsl";

            try
            {
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);

                cmd.Parameters.Add("@server", MySqlDbType.VarChar).Value = model.Server.Trim();
                cmd.Parameters.Add("@port", MySqlDbType.Int32).Value = model.Port;
                cmd.Parameters.Add("@senderName", MySqlDbType.VarChar).Value = model.SenderName.Trim();
                cmd.Parameters.Add("@senderEmail", MySqlDbType.VarChar).Value = model.SenderEmail.Trim().ToLower();
                cmd.Parameters.Add("@username", MySqlDbType.VarChar).Value = model.Username.Trim();
                cmd.Parameters.Add("@enableSsl", MySqlDbType.Bit).Value = model.EnableSsl;

                if (shouldUpdatePassword)
                {
                    cmd.Parameters.Add("@password", MySqlDbType.VarChar).Value = model.Password;
                }

                await con.OpenAsync();
                await cmd.ExecuteNonQueryAsync();

                // Optional: Broadcast config update safely over SignalR if needed
                // await _hubContext.Clients.All.SendAsync("SmtpUpdated");

                return Ok(new { message = "SMTP settings updated successfully." });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Error processing configuration update safely." });
            }
        }
    }

    
}

// using System;
// using System.Threading.Tasks;
// using BACKEND.Hubs;
// using BACKEND.Models;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.DataProtection;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.SignalR;
// using Microsoft.Extensions.Configuration;
// using MySql.Data.MySqlClient;

// namespace BACKEND.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     // [Authorize(Roles = "Admin")] // 🔒 Enforce Admin role across ALL endpoints by default
//     public class SmtpController : ControllerBase
//     {
//         private readonly IConfiguration _configuration;
//         private readonly IHubContext<NotificationHub> _hubContext;
//         private readonly IDataProtector _protector;

//         public SmtpController(
//             IConfiguration configuration, 
//             IHubContext<NotificationHub> hubContext,
//             IDataProtectionProvider provider)
//         {
//             _configuration = configuration;
//             _hubContext = hubContext;
//             // Create a dedicated protector instance for SMTP password encryption/decryption
//             _protector = provider.CreateProtector("SmtpController.PasswordProtection");
//         }

//         private MySqlConnection GetConnection()
//         {
//             return new MySqlConnection(_configuration.GetConnectionString("InvAppCon"));
//         }

//         // ========================
//         // GET SMTP SETTINGS
//         // ========================
//         [HttpGet("smtp-settings")]
//         public async Task<IActionResult> GetSmtpSettings()
//         {
//             string query = "SELECT server, port, sender_name, sender_email, username, enable_ssl FROM tbl_smtp_settings LIMIT 1";

//             try
//             {
//                 using var con = GetConnection();
//                 using var cmd = new MySqlCommand(query, con);

//                 await con.OpenAsync();
//                 using var reader = await cmd.ExecuteReaderAsync();

//                 if (await reader.ReadAsync())
//                 {
//                     var smtp = new
//                     {
//                         server = reader["server"].ToString(),
//                         port = Convert.ToInt32(reader["port"]),
//                         senderName = reader["sender_name"].ToString(),
//                         senderEmail = reader["sender_email"].ToString(),
//                         username = reader["username"].ToString(),
//                         password = "••••••••", // 🔒 NEVER expose the actual password back to default UI queries
//                         enableSsl = Convert.ToBoolean(reader["enable_ssl"])
//                     };

//                     return Ok(smtp);
//                 }

//                 return NotFound(new { message = "SMTP settings not found." });
//             }
//             catch (Exception)
//             {
//                 return StatusCode(500, new { message = "Error retrieving SMTP settings securely." });
//             }
//         }

//         // ========================
//         // UPDATE SMTP SETTINGS
//         // ========================
//         [HttpPut("update-smtp")]
//         public async Task<IActionResult> UpdateSmtp([FromBody] SmtpModel model)
//         {
//             bool shouldUpdatePassword = !string.IsNullOrWhiteSpace(model.Password) && model.Password != "••••••••";

//             string query = $@"UPDATE tbl_smtp_settings 
//                              SET server = @server,
//                                  port = @port,
//                                  sender_name = @senderName,
//                                  sender_email = @senderEmail,
//                                  username = @username,
//                                  {(shouldUpdatePassword ? "password = @password," : "")}
//                                  enable_ssl = @enableSsl";

//             try
//             {
//                 using var con = GetConnection();
//                 using var cmd = new MySqlCommand(query, con);

//                 cmd.Parameters.Add("@server", MySqlDbType.VarChar).Value = model.Server.Trim();
//                 cmd.Parameters.Add("@port", MySqlDbType.Int32).Value = model.Port;
//                 cmd.Parameters.Add("@senderName", MySqlDbType.VarChar).Value = model.SenderName.Trim();
//                 cmd.Parameters.Add("@senderEmail", MySqlDbType.VarChar).Value = model.SenderEmail.Trim().ToLower();
//                 cmd.Parameters.Add("@username", MySqlDbType.VarChar).Value = model.Username.Trim();
//                 cmd.Parameters.Add("@enableSsl", MySqlDbType.Bit).Value = model.EnableSsl;

//                 if (shouldUpdatePassword)
//                 {
//                     // Encrypt password before storing in DB
//                     string encryptedPassword = EncryptString(model.Password);
//                     cmd.Parameters.Add("@password", MySqlDbType.VarChar).Value = encryptedPassword;
//                 }

//                 await con.OpenAsync();
//                 await cmd.ExecuteNonQueryAsync();

//                 return Ok(new { message = "SMTP settings updated successfully." });
//             }
//             catch (Exception)
//             {
//                 return StatusCode(500, new { message = "Error processing configuration update safely." });
//             }
//         }

//         // ========================
//         // DECRYPT SMTP PASSWORD
//         // ========================
//         [HttpPost("decrypt-password")]
//         public async Task<IActionResult> DecryptPassword()
//         {
//             string query = "SELECT password FROM tbl_smtp_settings LIMIT 1";

//             try
//             {
//                 using var con = GetConnection();
//                 using var cmd = new MySqlCommand(query, con);

//                 await con.OpenAsync();
//                 var result = await cmd.ExecuteScalarAsync();

//                 if (result == null || result == DBNull.Value || string.IsNullOrWhiteSpace(result.ToString()))
//                 {
//                     return NotFound(new { message = "Stored password not found." });
//                 }

//                 string encryptedPassword = result.ToString();
//                 string decryptedPassword = DecryptString(encryptedPassword);

//                 return Ok(new { password = decryptedPassword });
//             }
//             catch (Exception)
//             {
//                 return StatusCode(500, new { message = "Error decrypting password securely." });
//             }
//         }

//         // ========================
//         // HELPER METHODS
//         // ========================
//         private string EncryptString(string plainText)
//         {
//             return _protector.Protect(plainText);
//         }
// private string DecryptString(string cipherText)
// {
//     if (string.IsNullOrWhiteSpace(cipherText))
//         return string.Empty;

//     try
//     {
//         return _protector.Unprotect(cipherText);
//     }
//     catch
//     {
//         // Fallback: If decryption fails (e.g. plain-text password in DB), return string as-is
//         return cipherText;
//     }
// }
//     }
// }