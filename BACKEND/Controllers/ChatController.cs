using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BACKEND.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using Microsoft.AspNetCore.SignalR;
using BACKEND.Hubs;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Data;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHubContext<NotificationHub> _hubContext;

        public ChatController(IConfiguration configuration, IHubContext<NotificationHub> hubContext)
        {
            _configuration = configuration;
            _hubContext = hubContext;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_configuration.GetConnectionString("InvAppCon"));
        }

        // ============================================================
        // GET: api/chat/chat/123
        // ============================================================
        [HttpGet("chat/{ticketId}")]
        public async Task<IActionResult> GetChatMessages(int ticketId)
        {
            var messages = new List<TicketMessageModel>();

            var query = @"SELECT MessageId, TicketId, SenderEmail, Message, Timestamp,
                                 FileName, FilePath, FileType, FileSize
                          FROM tbl_ticketmessages
                          WHERE TicketId = @TicketId
                          ORDER BY Timestamp ASC";

            try
            {
                await using var conn = GetConnection();
                await conn.OpenAsync();

                await using var cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@TicketId", ticketId);

                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    messages.Add(new TicketMessageModel
                    {
                        MessageId = reader.GetInt32("MessageId"),
                        TicketId = reader.GetInt32("TicketId"),
                        SenderEmail = reader.GetString("SenderEmail"),
                        Message = reader.GetString("Message"),
                        Timestamp = reader.GetDateTime("Timestamp"),

                        FileName = reader["FileName"] == DBNull.Value ? null : reader.GetString("FileName"),
                        FilePath = reader["FilePath"] == DBNull.Value ? null : reader.GetString("FilePath"),
                        FileType = reader["FileType"] == DBNull.Value ? null : reader.GetString("FileType"),
                        FileSize = reader["FileSize"] == DBNull.Value ? null : reader.GetInt64("FileSize")
                    });
                }

                return Ok(messages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while retrieving messages.",
                    error = ex.Message
                });
            }
        }

        // ============================================================
        // POST: api/chat/chat  (TEXT ONLY)
        // ============================================================
        [HttpPost("chat")]
        public async Task<IActionResult> PostMessage([FromBody] TicketMessageModel message)
        {
            if (message == null || string.IsNullOrWhiteSpace(message.Message))
            {
                return BadRequest(new { message = "Message content is required." });
            }

            var query = @"INSERT INTO tbl_ticketmessages (TicketId, SenderEmail, Message)
                          VALUES (@TicketId, @SenderEmail, @Message);
                          SELECT LAST_INSERT_ID();";

            try
            {
                await using var conn = GetConnection();
                await conn.OpenAsync();

                await using var cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@TicketId", message.TicketId);
                cmd.Parameters.AddWithValue("@SenderEmail", message.SenderEmail);
                cmd.Parameters.AddWithValue("@Message", message.Message);

                var insertedId = Convert.ToInt32(await cmd.ExecuteScalarAsync());

                var createdMessage = new TicketMessageModel
                {
                    MessageId = insertedId,
                    TicketId = message.TicketId,
                    SenderEmail = message.SenderEmail,
                    Message = message.Message,
                    Timestamp = DateTime.UtcNow
                };

                //                 await _hubContext.Clients.All.SendAsync("MessageAdded", createdMessage);
                //   await _hubContext.Clients.All.SendAsync("ReceiveMessage", createdMessage);
                if (NotificationHub.Connections.TryGetValue(message.SenderEmail, out var senderConnId))
                {
                    await _hubContext.Clients.AllExcept(senderConnId)
                                     .SendAsync("ReceiveMessage", createdMessage);
                }
                else
                {
                    // fallback, send to all
                    await _hubContext.Clients.All.SendAsync("MessageAdded", createdMessage);
                }
                await AddNotificationAsync(createdMessage);

                return Ok(createdMessage);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while sending the message.",
                    error = ex.Message
                });
            }
        }
        [HttpGet("download")]
        public IActionResult DownloadFile([FromQuery] string fileName)
        {
            try
            {
                if (string.IsNullOrEmpty(fileName))
                    return BadRequest(new { error = "File name is required." });

                var path = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "Assets",
                    "ChatFiles",
                    fileName
                );

                if (!System.IO.File.Exists(path))
                    return NotFound(new { error = "File not found." });

                var contentType = "application/octet-stream";
                return PhysicalFile(path, contentType, fileName);
            }
            catch (UnauthorizedAccessException ex)
            {
                // Access denied to file
                return StatusCode(403, new { error = "Access denied to file.", details = ex.Message });
            }
            catch (Exception ex)
            {
                // General error
                return StatusCode(500, new { error = "An unexpected error occurred while downloading the file.", details = ex.Message });
            }
        }
        // ============================================================
        // POST: api/chat/chat/upload  (TEXT + FILE)
        // ============================================================
        [HttpPost("chat/upload")]
        [RequestSizeLimit(50_000_000)] // 50MB
        public async Task<IActionResult> PostMessageWithFile([FromForm] ChatUploadRequest request)
        {
            if (request == null || request.TicketId <= 0 || string.IsNullOrWhiteSpace(request.SenderEmail))
                return BadRequest(new { message = "TicketId and SenderEmail are required." });

            bool hasText = !string.IsNullOrWhiteSpace(request.Message);
            bool hasFile = request.File != null && request.File.Length > 0;

            if (!hasText && !hasFile)
                return BadRequest(new { message = "Message or file is required." });

            string? fileName = null;
            string? filePath = null;
            string? fileType = null;
            long? fileSize = null;

            try
            {
                // ===========================
                // 1) SAVE FILE TO DESKTOP PATH
                // ===========================
                if (hasFile)
                {
                    fileName = request.File!.FileName;
                    fileType = request.File.ContentType;
                    fileSize = request.File.Length;

                    var uploadsFolder = Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "Assets",
                        "ChatFiles"
                    );

                    if (!Directory.Exists(uploadsFolder))
                        Directory.CreateDirectory(uploadsFolder);


                    var ext = Path.GetExtension(fileName);
                    var uniqueFileName = $"{Guid.NewGuid()}{ext}";
                    var fullPath = Path.Combine(uploadsFolder, uniqueFileName);

                    await using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await request.File.CopyToAsync(stream);
                    }

                    // This is what Angular will use:
                    filePath = $"/ChatFiles/{uniqueFileName}";
                }

                // ===========================
                // 2) INSERT INTO MYSQL
                // ===========================
                var query = @"
                    INSERT INTO tbl_ticketmessages
                    (TicketId, SenderEmail, Message, FileName, FilePath, FileType, FileSize)
                    VALUES
                    (@TicketId, @SenderEmail, @Message, @FileName, @FilePath, @FileType, @FileSize);
                    SELECT LAST_INSERT_ID();
                ";

                await using var conn = GetConnection();
                await conn.OpenAsync();

                await using var cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@TicketId", request.TicketId);
                cmd.Parameters.AddWithValue("@SenderEmail", request.SenderEmail);
                cmd.Parameters.AddWithValue("@Message", request.Message ?? "");

                cmd.Parameters.AddWithValue("@FileName", (object?)fileName ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FilePath", (object?)filePath ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FileType", (object?)fileType ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FileSize", (object?)fileSize ?? DBNull.Value);

                var insertedId = Convert.ToInt32(await cmd.ExecuteScalarAsync());

                var createdMessage = new TicketMessageModel
                {
                    MessageId = insertedId,
                    TicketId = request.TicketId,
                    SenderEmail = request.SenderEmail,
                    Message = request.Message ?? "",
                    Timestamp = DateTime.UtcNow,

                    FileName = fileName,
                    FilePath = filePath,
                    FileType = fileType,
                    FileSize = fileSize
                };

                //             await _hubContext.Clients.All.SendAsync("MessageAdded", createdMessage);
                //  await _hubContext.Clients.All.SendAsync("ReceiveMessage", createdMessage);
                if (NotificationHub.Connections.TryGetValue(createdMessage.SenderEmail, out var senderConnId))
                {
                    await _hubContext.Clients.AllExcept(senderConnId)
                                     .SendAsync("ReceiveMessage", createdMessage);
                }
                else
                {
                    // fallback, send to all
                    await _hubContext.Clients.All.SendAsync("MessageAdded", createdMessage);
                }
                return Ok(createdMessage);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while sending the message with file.",
                    error = ex.Message
                });
            }
        }


        private async Task AddNotificationAsync(TicketMessageModel message)
        {
            var query = @"
        INSERT INTO tbl_ticketnotifications
        (TicketId, RecipientEmail, SenderEmail, Message)
        SELECT @TicketId, Email, @SenderEmail, @Message
        FROM tbl_users
        WHERE Email <> @SenderEmail;
    ";

            await using var conn = GetConnection();
            await conn.OpenAsync();
            await using var cmd = new MySqlCommand(query, conn);
            cmd.Parameters.AddWithValue("@TicketId", message.TicketId);
            cmd.Parameters.AddWithValue("@SenderEmail", message.SenderEmail);
            cmd.Parameters.AddWithValue("@Message", message.Message);
            await cmd.ExecuteNonQueryAsync();
        }
        [HttpGet("notifications")]
        public async Task<IActionResult> GetUserNotifications([FromQuery] string email)
        {
            var notifications = new List<dynamic>();
            var query = @"
        SELECT NotificationId, TicketId, SenderEmail, Message, Timestamp, IsRead
        FROM tbl_ticketnotifications
        WHERE RecipientEmail = @Email
        ORDER BY Timestamp DESC
    ";

            try
            {
                await using var conn = GetConnection();
                await conn.OpenAsync();
                await using var cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Email", email);
                await using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    notifications.Add(new
                    {
                        NotificationId = reader.GetInt32("NotificationId"),
                        TicketId = reader.GetInt32("TicketId"),
                        SenderEmail = reader.GetString("SenderEmail"),
                        Message = reader.GetString("Message"),
                        Timestamp = reader.GetDateTime("Timestamp"),
                        IsRead = reader.GetBoolean("IsRead")
                    });
                }

                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving notifications", error = ex.Message });
            }
        }
        [HttpPost("notifications/read/{notificationId}")]
        public async Task<IActionResult> MarkNotificationRead(int notificationId)
        {
            var query = "UPDATE tbl_ticketnotifications SET IsRead = TRUE WHERE NotificationId = @Id";
            try
            {
                await using var conn = GetConnection();
                await conn.OpenAsync();
                await using var cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", notificationId);
                await cmd.ExecuteNonQueryAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error marking notification as read", error = ex.Message });
            }
        }

        [HttpPost("notifications/read-ticket")]
        public async Task<IActionResult> MarkTicketNotificationsRead([FromBody] ReadTicketRequest request)
        {
            var query = @"
        UPDATE tbl_ticketnotifications
        SET IsRead = TRUE
        WHERE TicketId = @TicketId AND RecipientEmail = @Email
    ";

            try
            {
                await using var conn = GetConnection();
                await conn.OpenAsync();
                await using var cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@TicketId", request.TicketId);
                cmd.Parameters.AddWithValue("@Email", request.Email);
                await cmd.ExecuteNonQueryAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error marking ticket notifications as read", error = ex.Message });
            }
        }
// GET: api/ticket/{ticketId}/number
[HttpGet("{ticketId}/number")]
public IActionResult GetTicketNumber(int ticketId)
{
    string query = "SELECT TicketNumber FROM tbl_tickets WHERE TicketId = @TicketId";

    try
    {
        using var con = GetConnection();
        using var cmd = new MySqlCommand(query, con);
        cmd.Parameters.AddWithValue("@TicketId", ticketId);
        con.Open();

        var result = cmd.ExecuteScalar();
        if (result == null)
            return NotFound(new { message = "Ticket not found" });

        return Ok(new { TicketNumber = result.ToString() });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "Error retrieving ticket number", error = ex.Message });
    }
}

    }
}