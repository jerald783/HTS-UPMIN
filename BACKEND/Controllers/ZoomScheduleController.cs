using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System.Data;
using BACKEND.Models;
using Microsoft.AspNetCore.SignalR;
using BACKEND.Hubs;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ZoomScheduleController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IHubContext<NotificationHub> _hubContext;

        public ZoomScheduleController(IConfiguration configuration, IHubContext<NotificationHub> hubContext)
        {
            _configuration = configuration;
            _hubContext = hubContext;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(
                _configuration.GetConnectionString("InvAppCon")
            );
        }

        // =====================================================
        // GET ALL
        // =====================================================
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                string query = @"
                    SELECT
                        Id,
                        ActivityName,SetupType,
                        DATE_FORMAT(EventDate,'%Y-%m-%d') AS EventDate,
                        DATE_FORMAT(StartDate,'%Y-%m-%d') AS StartDate,
                        DATE_FORMAT(EndDate,'%Y-%m-%d') AS EndDate,
                        TimeStart,
                        TimeEnd,
                        Status,
                        RequesterName,
                        RequesterEmail
                    FROM tbl_zoom_schedule";

                DataTable table = new();
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);
                con.Open();
                table.Load(cmd.ExecuteReader());

                return Ok(table);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        // =====================================================
        // GET BY DATE
        // =====================================================
        [HttpGet("bydate/{date}")]
        public IActionResult GetByDate(string date)
        {
            try
            {
                string query = @"
                    SELECT
                        Id,
                        ActivityName,
                        TimeStart,
                        TimeEnd,
                        Status,
                              RequesterName,
                        RequesterEmail,
                    FROM tbl_zoom_schedule
                    WHERE @Date BETWEEN
                        COALESCE(StartDate, EventDate)
                    AND COALESCE(EndDate, EventDate)";

                DataTable table = new();
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Date", date);
                con.Open();
                table.Load(cmd.ExecuteReader());

                return Ok(table);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        // =====================================================
        // GET BY ID
        // =====================================================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                string query = @"
                    SELECT
                        Id,
                        ActivityName,
                        SetupType,
                        ZoomDescription,
                        DATE_FORMAT(EventDate,'%Y-%m-%d') AS EventDate,
                        DATE_FORMAT(StartDate,'%Y-%m-%d') AS StartDate,
                        DATE_FORMAT(EndDate,'%Y-%m-%d') AS EndDate,
                        TimeStart,
                        TimeEnd,
                        AlternateHosts,
                        RequireRegistration,
                        DesiredPasscode,
                        RequesterName,
                        RequesterEmail,
                        OfficeUnitProject,
                        AdditionalDetails,
                        ConfigFile,
                        Status
                    FROM tbl_zoom_schedule
                    WHERE Id = @Id";

                DataTable table = new();
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Id", id);
                con.Open();
                table.Load(cmd.ExecuteReader());

                if (table.Rows.Count == 0)
                    return NotFound(new { message = "Schedule not found" });

                return Ok(table);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        // =====================================================
        // POST (INSERT)
        // =====================================================
        [HttpPost]
        [RequestSizeLimit(10 * 1024 * 1024)] // 10MB
        public async Task<IActionResult> Post([FromForm] ZoomScheduleModel z, IFormFile? file)
        {
            try
            {
                string? savedFileName = null;

                if (file != null && file.Length > 0)
                {
                    var allowedExt = new[] { ".pdf", ".doc", ".docx" };
                    var ext = Path.GetExtension(file.FileName).ToLower();

                    if (!allowedExt.Contains(ext))
                        return BadRequest("Invalid file type");

                    if (file.Length > 10 * 1024 * 1024)
                        return BadRequest("File exceeds 10MB");

                    var uploads = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "webinar-uploads");
                    Directory.CreateDirectory(uploads);

                    savedFileName = $"{Guid.NewGuid()}{ext}";
                    var filePath = Path.Combine(uploads, savedFileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);
                }

                string query = @"
                    INSERT INTO tbl_zoom_schedule
                    (
                        ActivityName, SetupType, ZoomDescription,
                        EventDate, StartDate, EndDate,
                        TimeStart, TimeEnd,
                        AlternateHosts, RequireRegistration,
                        DesiredPasscode, RequesterName, RequesterEmail,
                        OfficeUnitProject, AdditionalDetails,
                        ConfigFile, Status
                    )
                    VALUES
                    (
                        @ActivityName, @SetupType, @ZoomDescription,
                        @EventDate, @StartDate, @EndDate,
                        @TimeStart, @TimeEnd,
                        @AlternateHosts, @RequireRegistration,
                        @DesiredPasscode, @RequesterName, @RequesterEmail,
                        @OfficeUnitProject, @AdditionalDetails,
                        @ConfigFile, @Status
                    )";

                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);

                var start = z.StartDate == default ? z.EventDate : z.StartDate;
                var end = z.EndDate == default ? z.EventDate : z.EndDate;

                cmd.Parameters.AddWithValue("@ActivityName", z.ActivityName);
                cmd.Parameters.AddWithValue("@SetupType", z.SetupType);
                cmd.Parameters.AddWithValue("@ZoomDescription", z.ZoomDescription);
                cmd.Parameters.AddWithValue("@EventDate", z.EventDate ?? start);
                cmd.Parameters.AddWithValue("@StartDate", start);
                cmd.Parameters.AddWithValue("@EndDate", end);
                cmd.Parameters.AddWithValue("@TimeStart", z.TimeStart);
                cmd.Parameters.AddWithValue("@TimeEnd", z.TimeEnd);
                cmd.Parameters.AddWithValue("@AlternateHosts", z.AlternateHosts);
                cmd.Parameters.AddWithValue("@RequireRegistration", z.RequireRegistration);
                cmd.Parameters.AddWithValue("@DesiredPasscode", z.DesiredPasscode);
                cmd.Parameters.AddWithValue("@RequesterName", z.RequesterName);
                cmd.Parameters.AddWithValue("@RequesterEmail", z.RequesterEmail);
                cmd.Parameters.AddWithValue("@OfficeUnitProject", z.OfficeUnitProject);
                cmd.Parameters.AddWithValue("@AdditionalDetails", z.AdditionalDetails);
                cmd.Parameters.AddWithValue("@ConfigFile", savedFileName);
                cmd.Parameters.AddWithValue("@Status", z.Status ?? "Pending");

                con.Open();
                cmd.ExecuteNonQuery();

                await _hubContext.Clients.All.SendAsync("ZoomScheduleAdded", z);

                return Ok(new { message = "Zoom schedule added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        // =====================================================
        // GET BY USER
        // =====================================================
        [HttpGet("user/{email}")]
        public IActionResult GetByUser(string email)
        {
            try
            {
                string query = @"
                    SELECT
                        Id, ActivityName,
                        DATE_FORMAT(EventDate,'%Y-%m-%d') AS EventDate,
                        DATE_FORMAT(StartDate,'%Y-%m-%d') AS StartDate,
                        DATE_FORMAT(EndDate,'%Y-%m-%d') AS EndDate,
                        TimeStart, TimeEnd, Status
                    FROM tbl_zoom_schedule
                    WHERE RequesterEmail = @Email";

                DataTable table = new();
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Email", email);
                con.Open();
                table.Load(cmd.ExecuteReader());

                return Ok(table);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        // =====================================================
        // UPDATE STATUS
        // =====================================================
        [HttpPut("status/{id}")]
        public IActionResult UpdateStatus(int id, [FromBody] ZoomScheduleModel z)
        {
            try
            {
                string query = @"UPDATE tbl_zoom_schedule
                                 SET Status = @Status
                                 WHERE Id = @Id";

                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@Status", z.Status);

                con.Open();
                int rows = cmd.ExecuteNonQuery();

                if (rows == 0)
                    return NotFound(new { message = "Schedule not found" });

                return Ok(new { message = "Status updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        // =====================================================
        // FULL UPDATE
        // =====================================================
        [HttpPut("{id}")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        public async Task<IActionResult> Put(int id, [FromForm] ZoomScheduleModel z, IFormFile? file)
        {
            try
            {
                string? savedFileName = z.ConfigFile;

                if (file != null && file.Length > 0)
                {
                    var allowedExt = new[] { ".pdf", ".doc", ".docx" };
                    var ext = Path.GetExtension(file.FileName).ToLower();

                    if (!allowedExt.Contains(ext))
                        return BadRequest("Invalid file type");

                    if (file.Length > 10 * 1024 * 1024)
                        return BadRequest("File exceeds 10MB");

                    var uploads = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "webinar-uploads");
                    Directory.CreateDirectory(uploads);

                    savedFileName = $"{Guid.NewGuid()}{ext}";
                    var filePath = Path.Combine(uploads, savedFileName);

                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);
                }

                string query = @"
                    UPDATE tbl_zoom_schedule
                    SET
                        ActivityName = @ActivityName,
                        SetupType = @SetupType,
                        ZoomDescription = @ZoomDescription,
                        EventDate = @EventDate,
                        StartDate = @StartDate,
                        EndDate = @EndDate,
                        TimeStart = @TimeStart,
                        TimeEnd = @TimeEnd,
                        AlternateHosts = @AlternateHosts,
                        RequireRegistration = @RequireRegistration,
                        DesiredPasscode = @DesiredPasscode,
                        RequesterName = @RequesterName,
                        RequesterEmail = @RequesterEmail,
                        OfficeUnitProject = @OfficeUnitProject,
                        AdditionalDetails = @AdditionalDetails,
                        ConfigFile = @ConfigFile,
                        Status = @Status
                    WHERE Id = @Id";

                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);

                var start = z.StartDate == default ? z.EventDate : z.StartDate;
                var end = z.EndDate == default ? z.EventDate : z.EndDate;

                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Parameters.AddWithValue("@ActivityName", z.ActivityName);
                cmd.Parameters.AddWithValue("@SetupType", z.SetupType);
                cmd.Parameters.AddWithValue("@ZoomDescription", z.ZoomDescription);
                cmd.Parameters.AddWithValue("@EventDate", z.EventDate ?? start);
                cmd.Parameters.AddWithValue("@StartDate", start);
                cmd.Parameters.AddWithValue("@EndDate", end);
                cmd.Parameters.AddWithValue("@TimeStart", z.TimeStart);
                cmd.Parameters.AddWithValue("@TimeEnd", z.TimeEnd);
                cmd.Parameters.AddWithValue("@AlternateHosts", z.AlternateHosts);
                cmd.Parameters.AddWithValue("@RequireRegistration", z.RequireRegistration);
                cmd.Parameters.AddWithValue("@DesiredPasscode", z.DesiredPasscode);
                cmd.Parameters.AddWithValue("@RequesterName", z.RequesterName);
                cmd.Parameters.AddWithValue("@RequesterEmail", z.RequesterEmail);
                cmd.Parameters.AddWithValue("@OfficeUnitProject", z.OfficeUnitProject);
                cmd.Parameters.AddWithValue("@AdditionalDetails", z.AdditionalDetails);
                cmd.Parameters.AddWithValue("@ConfigFile", savedFileName);
                cmd.Parameters.AddWithValue("@Status", z.Status ?? "Pending");

                con.Open();
                int rows = cmd.ExecuteNonQuery();

                if (rows == 0)
                    return NotFound(new { message = "Schedule not found" });

                return Ok(new { message = "Zoom schedule updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        // =====================================================
        // GET ATTACHMENT
        // =====================================================
        [HttpGet("attachment/{fileName}")]
        public IActionResult GetAttachment(string fileName)
        {
            try
            {
                var uploads = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "webinar-uploads");
                var filePath = Path.Combine(uploads, fileName);

                if (!System.IO.File.Exists(filePath))
                    return NotFound();

                var contentType = fileName.EndsWith(".pdf") ? "application/pdf" :
                                  fileName.EndsWith(".doc") ? "application/msword" :
                                  fileName.EndsWith(".docx") ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" :
                                  "application/octet-stream";

                var bytes = System.IO.File.ReadAllBytes(filePath);
                return File(bytes, contentType, fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        // =====================================================
        // DELETE
        // =====================================================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                string query = "DELETE FROM tbl_zoom_schedule WHERE Id = @Id";

                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);
                cmd.Parameters.AddWithValue("@Id", id);
                con.Open();
                cmd.ExecuteNonQuery();

                return Ok(new { message = "Schedule deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }

        // [HttpGet("zoomstats")]
        // public IActionResult GetZoomStats(string? fromDate = null, string? toDate = null)
        // {
        //     try
        //     {
        //         string query = @"
        //             SELECT 
        //                 YEAR(COALESCE(StartDate, EventDate)) AS Year,
        //                 MONTH(COALESCE(StartDate, EventDate)) AS Month,
        //                 COUNT(*) AS Total,
        //                 SUM(CASE WHEN Status = 'Pending' THEN 1 ELSE 0 END) AS Pending,
        //                 SUM(CASE WHEN Status = 'Approved' THEN 1 ELSE 0 END) AS Approved,
        //                 SUM(CASE WHEN Status = 'Rejected' THEN 1 ELSE 0 END) AS Rejected
        //             FROM tbl_zoom_schedule
        //             WHERE (@FromDate IS NULL OR COALESCE(StartDate, EventDate) >= @FromDate)
        //               AND (@ToDate IS NULL OR COALESCE(EndDate, EventDate) <= @ToDate)
        //               AND (@ToDate IS NULL OR COALESCE(EndDate, EventDate) < DATE_ADD(@ToDate, INTERVAL 1 DAY))
        //             GROUP BY Year, Month
        //             ORDER BY Year, Month;";

        //         DataTable table = new();
        //         using var con = GetConnection();
        //         using var cmd = new MySqlCommand(query, con);

        //         cmd.Parameters.AddWithValue("@FromDate", (object)fromDate ?? DBNull.Value);
        //         cmd.Parameters.AddWithValue("@ToDate", (object)toDate ?? DBNull.Value);

        //         con.Open();
        //         table.Load(cmd.ExecuteReader());

        //         return Ok(table);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
        //     }
        // }

        [HttpGet("zoomstats")]
        public IActionResult GetZoomStats(string? fromDate = null, string? toDate = null)
        {
            try
            {
                // Replaced StartDate/EventDate with Timestamp
                string query = @"
            SELECT 
                YEAR(Timestamp) AS Year,
                MONTH(Timestamp) AS Month,
                DAY(Timestamp) AS Day,
                COUNT(*) AS Total,
                SUM(CASE WHEN Status = 'Pending' THEN 1 ELSE 0 END) AS Pending,
                SUM(CASE WHEN Status = 'Approved' THEN 1 ELSE 0 END) AS Approved,
                SUM(CASE WHEN Status = 'Rejected' THEN 1 ELSE 0 END) AS Rejected
            FROM tbl_zoom_schedule
            WHERE (@FromDate IS NULL OR Timestamp >= @FromDate)
              AND (@ToDate IS NULL OR Timestamp < DATE_ADD(@ToDate, INTERVAL 1 DAY))
            GROUP BY YEAR(Timestamp), MONTH(Timestamp), DAY(Timestamp)
            ORDER BY Year, Month, Day;";

                DataTable table = new();
                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);

                cmd.Parameters.AddWithValue("@FromDate",
                    string.IsNullOrEmpty(fromDate) ? DBNull.Value : DateTime.Parse(fromDate));

                cmd.Parameters.AddWithValue("@ToDate",
                    string.IsNullOrEmpty(toDate) ? DBNull.Value : DateTime.Parse(toDate));

                con.Open();
                table.Load(cmd.ExecuteReader());

                return Ok(table);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", detail = ex.Message });
            }
        }
    }
}


