

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System.Data;
using BACKEND.Models;
using Microsoft.AspNetCore.SignalR;
using BACKEND.Hubs;
using Microsoft.AspNetCore.StaticFiles;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketController : ControllerBase
    {
        // ============================================================
        // DEPENDENCIES & CONSTANTS
        // ============================================================
        private readonly IConfiguration _configuration;
        private readonly IHubContext<NotificationHub> _hubContext;

        private readonly TimeSpan OfficeStart = new TimeSpan(8, 0, 0);
        private readonly TimeSpan OfficeEnd = new TimeSpan(17, 0, 0);

        public TicketController(IConfiguration configuration, IHubContext<NotificationHub> hubContext)
        {
            _configuration = configuration;
            _hubContext = hubContext;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_configuration.GetConnectionString("InvAppCon"));
        }

        // ============================================================
        // GET: ALL TICKETS
        // ============================================================
        [HttpGet("GettAllTickets")]
        public IActionResult GettAllTickets()
        {
            string query = "SELECT *, ReopenCount FROM tbl_tickets";

            DataTable table = new();

            try
            {
                using (var con = GetConnection())
                using (var cmd = new MySqlCommand(query, con))
                {
                    con.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        table.Load(reader);
                    }
                }

                return Ok(table);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // ============================================================
        // GET: TICKET BY USER
        // ============================================================
        [HttpGet("GetTicketByUser/{fromemail}")]
        public IActionResult GetTicketByUser(string fromemail)
        {
            string query = @"
                SELECT TicketId, TicketNumber, PropNo, FullName, Email, RequestDate,
                       HelpTopic, IssueDesc, Location, PriorityLevel, CurrentStatus,
                       LastUpdated, DueDate, Overdue, AgentAssigned, ReopenCount,
                       FileName, FileContentType
                FROM tbl_tickets
                WHERE Email = @FromEmail";

            DataTable table = new();

            try
            {
                using (var con = GetConnection())
                using (var cmd = new MySqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@FromEmail", fromemail);

                    con.Open();
                    using (var reader = cmd.ExecuteReader())
                    {
                        table.Load(reader);
                    }
                }

                return Ok(table);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // ============================================================
        // GET: TICKET STATISTICS
        // ============================================================
        // [HttpGet("GetTicketStats")]
        // public IActionResult GetTicketStats([FromQuery] string? fromDate = null, [FromQuery] string? toDate = null)
        // {
        //     string query = @"
        //         SELECT 
        //             YEAR(RequestDate) AS Year,
        //             MONTH(RequestDate) AS Month,
        //             COUNT(*) AS Created,
        //             SUM(CASE WHEN CurrentStatus IN ('Resolved','Closed') THEN 1 ELSE 0 END) AS Closed,
        //             SUM(CASE WHEN CurrentStatus = 'Reopened' THEN 1 ELSE 0 END) AS Reopened,
        //             SUM(CASE WHEN AgentAssigned IS NOT NULL AND AgentAssigned <> '' THEN 1 ELSE 0 END) AS Assigned,
        //             SUM(CASE WHEN Overdue = 1 THEN 1 ELSE 0 END) AS Overdue,
        //             SUM(ReopenCount) AS TotalReopenEvents
        //         FROM tbl_tickets
        //         WHERE 
        //         (@FromDate IS NULL OR RequestDate >= @FromDate)
        //           AND (@ToDate IS NULL OR RequestDate <= @ToDate)
        //           AND (@ToDate IS NULL OR RequestDate < DATE_ADD(@ToDate, INTERVAL 1 DAY))
        //         GROUP BY YEAR(RequestDate), MONTH(RequestDate)
        //         ORDER BY Year, Month;
        //     ";

        //     var stats = new List<object>();

        //     try
        //     {
        //         using (var con = GetConnection())
        //         using (var cmd = new MySqlCommand(query, con))
        //         {
        //             cmd.Parameters.AddWithValue("@FromDate",
        //                 string.IsNullOrEmpty(fromDate) ? DBNull.Value : DateTime.Parse(fromDate));

        //             cmd.Parameters.AddWithValue("@ToDate",
        //                 string.IsNullOrEmpty(toDate) ? DBNull.Value : DateTime.Parse(toDate));

        //             con.Open();

        //             using (var reader = cmd.ExecuteReader())
        //             {
        //                 while (reader.Read())
        //                 {
        //                     stats.Add(new
        //                     {
        //                         Year = Convert.ToInt32(reader["Year"]),
        //                         Month = Convert.ToInt32(reader["Month"]),
        //                         Created = Convert.ToInt32(reader["Created"]),
        //                         Closed = Convert.ToInt32(reader["Closed"]),
        //                         Reopened = Convert.ToInt32(reader["Reopened"]),
        //                         Assigned = Convert.ToInt32(reader["Assigned"]),
        //                         Overdue = Convert.ToInt32(reader["Overdue"]),
        //                         TotalReopenEvents = Convert.ToInt32(reader["TotalReopenEvents"])
        //                     });
        //                 }
        //             }
        //         }

        //         return Ok(stats);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, $"Internal Server Error: {ex.Message}");
        //     }
        // }
[HttpGet("GetTicketStats")]
public IActionResult GetTicketStats([FromQuery] string? fromDate = null, [FromQuery] string? toDate = null)
{
    string query = @"
        SELECT 
            YEAR(RequestDate) AS Year,
            MONTH(RequestDate) AS Month,
            DAY(RequestDate) AS Day,
            COUNT(*) AS Created,
            SUM(CASE WHEN CurrentStatus IN ('Resolved','Closed') THEN 1 ELSE 0 END) AS Closed,
            SUM(CASE WHEN CurrentStatus = 'Reopened' THEN 1 ELSE 0 END) AS Reopened,
            SUM(CASE WHEN AgentAssigned IS NOT NULL AND AgentAssigned <> '' THEN 1 ELSE 0 END) AS Assigned,
            SUM(CASE WHEN Overdue = 1 THEN 1 ELSE 0 END) AS Overdue,
            SUM(IFNULL(ReopenCount, 0)) AS TotalReopenEvents
        FROM tbl_tickets
        WHERE 
            (@FromDate IS NULL OR RequestDate >= @FromDate)
            AND (@ToDate IS NULL OR RequestDate < DATE_ADD(@ToDate, INTERVAL 1 DAY))
        GROUP BY YEAR(RequestDate), MONTH(RequestDate), DAY(RequestDate)
        ORDER BY Year, Month, Day;
    ";

    var stats = new List<object>();

    try
    {
        using (var con = GetConnection())
        using (var cmd = new MySqlCommand(query, con))
        {
            cmd.Parameters.AddWithValue("@FromDate",
                string.IsNullOrEmpty(fromDate) ? DBNull.Value : DateTime.Parse(fromDate));

            cmd.Parameters.AddWithValue("@ToDate",
                string.IsNullOrEmpty(toDate) ? DBNull.Value : DateTime.Parse(toDate));

            con.Open();

            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    stats.Add(new
                    {
                        Year = Convert.ToInt32(reader["Year"]),
                        Month = Convert.ToInt32(reader["Month"]),
                        Day = Convert.ToInt32(reader["Day"]),
                        Created = Convert.ToInt32(reader["Created"]),
                        Closed = Convert.ToInt32(reader["Closed"]),
                        Reopened = Convert.ToInt32(reader["Reopened"]),
                        Assigned = Convert.ToInt32(reader["Assigned"]),
                        Overdue = Convert.ToInt32(reader["Overdue"]),
                        TotalReopenEvents = Convert.ToInt32(reader["TotalReopenEvents"])
                    });
                }
            }
        }

        return Ok(stats);
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal Server Error: {ex.Message}");
    }
}
        // ============================================================
        // ADD TICKET (NO FILE)
        // ============================================================
        [HttpPost("AddTicket")]
        public async Task<IActionResult> AddTicket(TicketModel ticket)
        {
            DateTime now = DateTime.Now;
            DateTime dueDate = CalculateBusinessDueDate(now, ticket.PriorityLevel ?? "Medium");

            string query = @"INSERT INTO tbl_tickets 
                (TicketNumber, PropNo, FullName, Email, RequestDate,
                 HelpTopic, IssueDesc, Location, PriorityLevel,
                 CurrentStatus, LastUpdated, DueDate, Overdue,
                 AgentAssigned, ReopenCount, ExtraFields)
                VALUES 
                (@TicketNumber, @PropNo, @FullName, @Email, @RequestDate,
                 @HelpTopic, @IssueDesc, @Location, @PriorityLevel,
                 @CurrentStatus, @LastUpdated, @DueDate,
                 @Overdue, @AgentAssigned, 0, @ExtraFields)";

            try
            {
                using (var con = GetConnection())
                using (var cmd = new MySqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@TicketNumber", ticket.TicketNumber);
                    cmd.Parameters.AddWithValue("@PropNo", ticket.PropNo ?? "");
                    cmd.Parameters.AddWithValue("@FullName", ticket.FullName ?? "");
                    cmd.Parameters.AddWithValue("@Email", ticket.Email ?? "");
                    cmd.Parameters.AddWithValue("@RequestDate", now);
                    cmd.Parameters.AddWithValue("@HelpTopic", ticket.HelpTopic ?? "");
                    cmd.Parameters.AddWithValue("@IssueDesc", ticket.IssueDesc ?? "");
                    cmd.Parameters.AddWithValue("@Location", ticket.Location ?? "");
                    cmd.Parameters.AddWithValue("@PriorityLevel", ticket.PriorityLevel ?? "Medium");
                    cmd.Parameters.AddWithValue("@CurrentStatus", ticket.CurrentStatus ?? "Pending");
                    cmd.Parameters.AddWithValue("@LastUpdated", now);
                    cmd.Parameters.AddWithValue("@DueDate", dueDate);
                    cmd.Parameters.AddWithValue("@Overdue", ticket.Overdue);
                    cmd.Parameters.AddWithValue("@AgentAssigned", ticket.AgentAssigned ?? "");
                    cmd.Parameters.AddWithValue("@ExtraFields", ticket.ExtraFields ?? "");

                    con.Open();
                    cmd.ExecuteNonQuery();
                }

                await _hubContext.Clients.All.SendAsync("TicketAdded", ticket);
                return Ok(new { message = "Ticket added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // ============================================================
        // ADD TICKET (WITH FILES)
        // ============================================================
        [HttpPost("AddTicketWithFiles")]
        public async Task<IActionResult> AddTicketWithFiles([FromForm] TicketModel ticket)
        {
            try
            {
                string? savedFileName = null;
                string? fileContentType = null;

                if (ticket.Files != null && ticket.Files.Count > 0)
                {
                    var file = ticket.Files[0];
                    fileContentType = file.ContentType;

                    var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "TicketFiles");
                    if (!Directory.Exists(uploadDir)) Directory.CreateDirectory(uploadDir);

                    savedFileName = $"{Guid.NewGuid()}_{file.FileName}";
                    var filePath = Path.Combine(uploadDir, savedFileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);
                }

                DateTime now = DateTime.Now;
                DateTime dueDate = CalculateBusinessDueDate(now, ticket.PriorityLevel ?? "Medium");

                string query = @"INSERT INTO tbl_tickets 
                    (TicketNumber, PropNo, FullName, Email, RequestDate,
                     HelpTopic, IssueDesc, Location, PriorityLevel,
                     CurrentStatus, LastUpdated, DueDate, Overdue,
                     AgentAssigned, ReopenCount, FileName, FileContentType, ExtraFields)
                    VALUES 
                    (@TicketNumber, @PropNo, @FullName, @Email, @RequestDate,
                     @HelpTopic, @IssueDesc, @Location, @PriorityLevel,
                     @CurrentStatus, @LastUpdated, @DueDate,
                     @Overdue, @AgentAssigned, 0,
                     @FileName, @FileContentType, @ExtraFields)";

                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);

                cmd.Parameters.AddWithValue("@TicketNumber", ticket.TicketNumber);
                cmd.Parameters.AddWithValue("@PropNo", ticket.PropNo ?? "");
                cmd.Parameters.AddWithValue("@FullName", ticket.FullName ?? "");
                cmd.Parameters.AddWithValue("@Email", ticket.Email ?? "");
                cmd.Parameters.AddWithValue("@RequestDate", now);
                cmd.Parameters.AddWithValue("@HelpTopic", ticket.HelpTopic ?? "");
                cmd.Parameters.AddWithValue("@IssueDesc", ticket.IssueDesc ?? "");
                cmd.Parameters.AddWithValue("@Location", ticket.Location ?? "");
                cmd.Parameters.AddWithValue("@PriorityLevel", ticket.PriorityLevel ?? "Medium");
                cmd.Parameters.AddWithValue("@CurrentStatus", ticket.CurrentStatus ?? "Pending");
                cmd.Parameters.AddWithValue("@LastUpdated", now);
                cmd.Parameters.AddWithValue("@DueDate", dueDate);
                cmd.Parameters.AddWithValue("@Overdue", ticket.Overdue);
                cmd.Parameters.AddWithValue("@AgentAssigned", ticket.AgentAssigned ?? "");
                cmd.Parameters.AddWithValue("@FileName", savedFileName ?? "");
                cmd.Parameters.AddWithValue("@FileContentType", fileContentType ?? "");
                cmd.Parameters.AddWithValue("@ExtraFields", ticket.ExtraFields ?? "");

                con.Open();
                cmd.ExecuteNonQuery();

                await _hubContext.Clients.All.SendAsync("TicketAdded", ticket);
                return Ok(new { message = "Ticket added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // ============================================================
        // FILE DOWNLOAD
        // ============================================================
        [HttpGet("file/{fileName}")]
        public IActionResult GetTicketFile(string fileName)
        {
            try
            {
                var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "TicketFiles");
                var filePath = Path.Combine(uploadDir, fileName);

                if (!System.IO.File.Exists(filePath))
                    return NotFound("File not found");

                var contentType = "application/octet-stream";
                new FileExtensionContentTypeProvider().TryGetContentType(filePath, out string? mime);
                if (!string.IsNullOrEmpty(mime)) contentType = mime;

                var fileBytes = System.IO.File.ReadAllBytes(filePath);
                return File(fileBytes, contentType, Path.GetFileName(filePath));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

  
[HttpPut("UpdateStatus/{id}")]
public IActionResult UpdateStatus(int id, [FromBody] TicketStatusModel dto)
{
    // Subquery retrieves FullName from tbl_users based on the incoming email parameter
    string query = @"
        UPDATE tbl_tickets 
        SET CurrentStatus = @CurrentStatus, 
            AgentAssigned = COALESCE(
                (SELECT FullName FROM tbl_users WHERE Email = @AgentEmail LIMIT 1), 
                'Unassigned'
            ),
            LastUpdated = NOW(),
            ReopenCount = CASE 
                WHEN @CurrentStatus = 'Reopened' THEN ReopenCount + 1
                ELSE ReopenCount
            END
        WHERE TicketId = @TicketId";

    try
    {
        using (var con = GetConnection())
        using (var cmd = new MySqlCommand(query, con))
        {
            cmd.Parameters.AddWithValue("@CurrentStatus", dto.CurrentStatus);
            cmd.Parameters.AddWithValue("@AgentEmail", dto.AgentAssigned ?? string.Empty);
            cmd.Parameters.AddWithValue("@TicketId", id);

            con.Open();
            int rowsAffected = cmd.ExecuteNonQuery();

            if (rowsAffected == 0)
                return NotFound(new { message = "Ticket not found" });
        }

        return Ok(new { message = "Ticket status updated successfully" });
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal Server Error: {ex.Message}");
    }
}

        // // ============================================================
        // UPDATE: OVERDUE
        // ============================================================
        [HttpPut("UpdateOverdueTickets")]
        public IActionResult UpdateOverdueTickets()
        {
            string query = @"
                UPDATE tbl_tickets
                SET Overdue = CASE
                    WHEN CurrentStatus NOT IN ('Resolved', 'Closed')
                         AND DueDate IS NOT NULL
                         AND NOW() > DueDate THEN 1

                    WHEN CurrentStatus IN ('Resolved', 'Closed')
                         AND DueDate IS NOT NULL
                         AND LastUpdated > DueDate THEN 1
                    ELSE 0
                END;";

            try
            {
                using (var con = GetConnection())
                using (var cmd = new MySqlCommand(query, con))
                {
                    con.Open();
                    int rows = cmd.ExecuteNonQuery();
                    return Ok(new { message = $"{rows} tickets updated for overdue status." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // ============================================================
        // DELETE: TICKET
        // ============================================================
        [HttpDelete("{id}")]
        public IActionResult DeleteTicket(int id)
        {
            string query = "DELETE FROM tbl_tickets WHERE TicketId = @TicketId";

            try
            {
                using (var con = GetConnection())
                using (var cmd = new MySqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@TicketId", id);
                    con.Open();
                    cmd.ExecuteNonQuery();
                }

                return Ok(new { message = "Deleted Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // ============================================================
        // DELETE: MESSAGES BY TICKET
        // ============================================================
        [HttpDelete("DeleteMessagesByTicket/{ticketId}")]
        public IActionResult DeleteMessagesByTicket(int ticketId)
        {
            try
            {
                using var conn = GetConnection();
                conn.Open();

                using var cmd = new MySqlCommand(
                    "DELETE FROM tbl_ticketmessages WHERE TicketId = @TicketId", conn);

                cmd.Parameters.AddWithValue("@TicketId", ticketId);

                int rowsAffected = cmd.ExecuteNonQuery();

                return Ok(new { message = $"{rowsAffected} message(s) deleted for ticket." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        // ============================================================
        // SUPPORT DATA
        // ============================================================
        [HttpGet("GetAgents")]
        public IActionResult GetAgents()
        {
            string query = @"SELECT UserId, FullName, Email FROM tbl_users WHERE RoleId = 2";

            DataTable table = new();

            using (var con = GetConnection())
            using (var cmd = new MySqlCommand(query, con))
            {
                con.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    table.Load(reader);
                }
            }

            return Ok(table);
        }

        [HttpPut("AssignAgent/{ticketId}")]
        public async Task<IActionResult> AssignAgent(int ticketId, [FromBody] AssignAgentDto dto)
        {
            string query = "UPDATE tbl_tickets SET AgentAssigned = @Agent WHERE TicketId = @Id";

            using var con = GetConnection();
            using var cmd = new MySqlCommand(query, con);

            cmd.Parameters.AddWithValue("@Agent", dto.AgentAssigned);
            cmd.Parameters.AddWithValue("@Id", ticketId);

            await con.OpenAsync();
            int rows = await cmd.ExecuteNonQueryAsync();

            if (rows == 0)
                return NotFound(new { message = "Ticket not found" });

            return Ok(new { message = "Agent assigned successfully" });
        }

        // ============================================================
        // AGENT STATS
        // ============================================================
        // [HttpGet("GetAgentClosingStats")]
        // public IActionResult GetAgentClosingStats(
        //     [FromQuery] string? fromDate = null,
        //     [FromQuery] string? toDate = null,
        //     [FromQuery] int? year = null)
        // {
        //     string query = @"
        //         SELECT 
        //             IFNULL(NULLIF(AgentAssigned, ''), 'Unassigned') AS Agent,
        //             COUNT(*) AS ClosedTickets
        //         FROM tbl_tickets
        //         WHERE 
        //             CurrentStatus IN ('Resolved', 'Closed')
        //             AND (@FromDate IS NULL OR LastUpdated >= @FromDate)
        //             AND (@ToDate IS NULL OR LastUpdated <= DATE_ADD(@ToDate, INTERVAL 1 DAY))
        //             AND (@Year IS NULL OR YEAR(LastUpdated) = @Year)
        //         GROUP BY AgentAssigned
        //         ORDER BY ClosedTickets DESC;
        //     ";

        //     DataTable table = new();

        //     try
        //     {
        //         using (var con = GetConnection())
        //         using (var cmd = new MySqlCommand(query, con))
        //         {
        //             cmd.Parameters.AddWithValue("@FromDate",
        //                 string.IsNullOrEmpty(fromDate) ? DBNull.Value : DateTime.Parse(fromDate));

        //             cmd.Parameters.AddWithValue("@ToDate",
        //                 string.IsNullOrEmpty(toDate) ? DBNull.Value : DateTime.Parse(toDate));

        //             cmd.Parameters.AddWithValue("@Year",
        //                 year.HasValue ? year.Value : DBNull.Value);

        //             con.Open();
        //             using (var reader = cmd.ExecuteReader())
        //             {
        //                 table.Load(reader);
        //             }
        //         }

        //         return Ok(table);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, $"Internal Server Error: {ex.Message}");
        //     }
        // }
// ============================================================
// AGENT STATS
// ============================================================
[HttpGet("GetAgentClosingStats")]
public IActionResult GetAgentClosingStats(
    [FromQuery] string? fromDate = null,
    [FromQuery] string? toDate = null,
    [FromQuery] int? year = null)
{
    string query = @"
        SELECT 
            IFNULL(NULLIF(AgentAssigned, ''), 'Unassigned') AS Agent,
            COUNT(*) AS ClosedTickets
        FROM tbl_tickets
        WHERE 
            CurrentStatus IN ('Resolved', 'Closed')
            AND (@FromDate IS NULL OR RequestDate >= @FromDate)
            AND (@ToDate IS NULL OR RequestDate < DATE_ADD(@ToDate, INTERVAL 1 DAY))
            AND (@Year IS NULL OR YEAR(RequestDate) = @Year)
        GROUP BY Agent
        ORDER BY ClosedTickets DESC;";

    DataTable table = new();

    try
    {
        using (var con = GetConnection())
        using (var cmd = new MySqlCommand(query, con))
        {
            cmd.Parameters.AddWithValue("@FromDate", (object?)fromDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@ToDate", (object?)toDate ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Year", (object?)year ?? DBNull.Value);

            con.Open();
            using (var reader = cmd.ExecuteReader())
            {
                table.Load(reader);
            }
        }

        return Ok(table);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
    }
}
        // ============================================================
        // BUSINESS LOGIC: DUE DATE CALCULATION
        // ============================================================
        [HttpGet("CalculateDueDate")]
        public IActionResult GetCalculatedDueDate([FromQuery] string priority, [FromQuery] DateTime? startDate = null)
        {
            DateTime dateToUse = startDate ?? DateTime.Now;
            DateTime calculatedDueDate = CalculateBusinessDueDate(dateToUse, priority);

            return Ok(new { startDate = dateToUse, priority, dueDate = calculatedDueDate });
        }

        private DateTime CalculateBusinessDueDate(DateTime startDate, string priority)
        {
            int businessDays = priority switch
            {
                "High" => 1,
                "Medium" => 3,
                "Low" => 5,
                _ => 3
            };

            DateTime current = startDate;

            // If weekend, move to Monday 8:00 AM
            while (current.DayOfWeek == DayOfWeek.Saturday || current.DayOfWeek == DayOfWeek.Sunday)
            {
                current = current.Date.AddDays(1).Add(OfficeStart);
            }

            // Before office hours
            if (current.TimeOfDay < OfficeStart)
            {
                current = current.Date.Add(OfficeStart);
            }

            // After office hours
            if (current.TimeOfDay >= OfficeEnd)
            {
                current = current.Date.AddDays(1).Add(OfficeStart);

                while (current.DayOfWeek == DayOfWeek.Saturday || current.DayOfWeek == DayOfWeek.Sunday)
                {
                    current = current.Date.AddDays(1).Add(OfficeStart);
                }
            }

            TimeSpan timeOfDay = current.TimeOfDay;

            while (businessDays > 0)
            {
                current = current.AddDays(1);
                // Skips Saturday and Sunday
                if (current.DayOfWeek != DayOfWeek.Saturday && current.DayOfWeek != DayOfWeek.Sunday)
                {
                    businessDays--;
                }
            }

            return current.Date.Add(timeOfDay);
        }

        // ============================================================
// GET: SLA COMPLIANCE STATISTICS BY PRIORITY
// ============================================================
[HttpGet("GetSlaComplianceStats")]
public IActionResult GetSlaComplianceStats([FromQuery] string? fromDate = null, [FromQuery] string? toDate = null)
{
    string query = @"
        SELECT 
            PriorityLevel,
            COUNT(*) AS TotalResolved,
            SUM(CASE WHEN LastUpdated <= DueDate THEN 1 ELSE 0 END) AS WithinSLA,
            SUM(CASE WHEN LastUpdated > DueDate OR (DueDate IS NULL) THEN 1 ELSE 0 END) AS BeyondSLA
        FROM tbl_tickets
        WHERE CurrentStatus IN ('Resolved', 'Closed')
          AND (@FromDate IS NULL OR RequestDate >= @FromDate)
          AND (@ToDate IS NULL OR RequestDate <= DATE_ADD(@ToDate, INTERVAL 1 DAY))
        GROUP BY PriorityLevel;";

    var slaStats = new List<object>();

    try
    {
        using (var con = GetConnection())
        using (var cmd = new MySqlCommand(query, con))
        {
            cmd.Parameters.AddWithValue("@FromDate",
                string.IsNullOrEmpty(fromDate) ? DBNull.Value : DateTime.Parse(fromDate));

            cmd.Parameters.AddWithValue("@ToDate",
                string.IsNullOrEmpty(toDate) ? DBNull.Value : DateTime.Parse(toDate));

            con.Open();

            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    slaStats.Add(new
                    {
                        Priority = reader["PriorityLevel"].ToString(),
                        TotalResolved = Convert.ToInt32(reader["TotalResolved"]),
                        WithinSLA = Convert.ToInt32(reader["WithinSLA"]),
                        BeyondSLA = Convert.ToInt32(reader["BeyondSLA"]),
                        SlaPercentage = Convert.ToInt32(reader["TotalResolved"]) > 0 
                            ? Math.Round((Convert.ToDouble(reader["WithinSLA"]) / Convert.ToDouble(reader["TotalResolved"])) * 100, 2)
                            : 0 
                    });
                }
            }
        }

        return Ok(slaStats);
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Internal Server Error: {ex.Message}");
    }
}
    
    
    
    
    }
}



