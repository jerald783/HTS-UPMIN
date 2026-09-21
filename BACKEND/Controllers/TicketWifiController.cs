using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using BACKEND.Hubs;
using BACKEND.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MySql.Data.MySqlClient;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketWifiController : ControllerBase
    {

        // ============================================================
        // DEPENDENCIES
        // ============================================================
        private readonly IConfiguration _configuration;
        private readonly IHubContext<NotificationHub> _hubContext;

        public TicketWifiController(IConfiguration configuration, IHubContext<NotificationHub> hubContext)
        {
            _configuration = configuration;
            _hubContext = hubContext;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_configuration.GetConnectionString("InvAppCon"));
        }







        // ============================================================
        // GET: SUPPORT REQUESTS
        // ============================================================
        [HttpGet("GetAllSupportRequests")]
        public IActionResult GetAllSupportRequests()
        {
            string query = "SELECT * FROM tbl_support_requests ORDER BY id DESC";

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
        // GET: SUPPORT REQUEST BY EMAIL
        // ============================================================
        [HttpGet("GetSupportRequestByEmail/{email}")]
        public IActionResult GetSupportRequestByEmail(string email)
        {
            string query = @"
        SELECT * 
        FROM tbl_support_requests
        WHERE up_email = @Email
        ORDER BY id DESC";

            DataTable table = new();

            try
            {
                using (var con = GetConnection())
                using (var cmd = new MySqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Email", email);

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
        // ADD SUPPORT REQUEST
        // ============================================================
        [HttpPost("AddSupportRequest")]
        public IActionResult AddSupportRequest([FromBody] SupportRequestModel request)
        {
            string query = @"
        INSERT INTO tbl_support_requests
        (
            name,
            up_email,
            request_date,
            category,
            course_dept,
            concern,
            status,
            username,
            password,
            date_resolved,
            notes
        )
        VALUES
        (
            @Name,
            @UpEmail,
            @RequestDate,
            @Category,
            @CourseDept,
            @Concern,
            @Status,
            @Username,
            @Password,
            @DateResolved,
            @Notes
        )";

            try
            {
                using (var con = GetConnection())
                using (var cmd = new MySqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Name", request.Name ?? "");
                    cmd.Parameters.AddWithValue("@UpEmail", request.UpEmail ?? "");
                    cmd.Parameters.AddWithValue("@RequestDate", request.RequestDate);
                    cmd.Parameters.AddWithValue("@Category", request.Category ?? "");
                    cmd.Parameters.AddWithValue("@CourseDept", request.CourseDept ?? "");
                    cmd.Parameters.AddWithValue("@Concern", request.Concern ?? "");
                    cmd.Parameters.AddWithValue("@Status", request.Status ?? "Pending");
                    cmd.Parameters.AddWithValue("@Username", request.Username ?? "");
                    cmd.Parameters.AddWithValue("@Password", request.Password ?? "");
                    cmd.Parameters.AddWithValue("@DateResolved",
                        request.DateResolved == null
                        ? DBNull.Value
                        : request.DateResolved);

                    cmd.Parameters.AddWithValue("@Notes", request.Notes ?? "");

                    con.Open();
                    cmd.ExecuteNonQuery();
                }

                return Ok(new { message = "Support request added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // ============================================================
        // UPDATE SUPPORT REQUEST
        // ============================================================
        [HttpPut("UpdateSupportRequest/{id}")]
        public IActionResult UpdateSupportRequest(int id, [FromBody] SupportRequestModel request)
        {
            string query = @"
        UPDATE tbl_support_requests
        SET
            name = @Name,
            up_email = @UpEmail,
            request_date = @RequestDate,
            category = @Category,
            course_dept = @CourseDept,
            concern = @Concern,
            status = @Status,
            username = @Username,
            password = @Password,
            date_resolved = @DateResolved,
            notes = @Notes
        WHERE id = @Id";

            try
            {
                using (var con = GetConnection())
                using (var cmd = new MySqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);
                    cmd.Parameters.AddWithValue("@Name", request.Name ?? "");
                    cmd.Parameters.AddWithValue("@UpEmail", request.UpEmail ?? "");
                    cmd.Parameters.AddWithValue("@RequestDate", request.RequestDate);
                    cmd.Parameters.AddWithValue("@Category", request.Category ?? "");
                    cmd.Parameters.AddWithValue("@CourseDept", request.CourseDept ?? "");
                    cmd.Parameters.AddWithValue("@Concern", request.Concern ?? "");
                    cmd.Parameters.AddWithValue("@Status", request.Status ?? "Pending");
                    cmd.Parameters.AddWithValue("@Username", request.Username ?? "");
                    cmd.Parameters.AddWithValue("@Password", request.Password ?? "");

                    cmd.Parameters.AddWithValue("@DateResolved",
                        request.DateResolved == null
                        ? DBNull.Value
                        : request.DateResolved);

                    cmd.Parameters.AddWithValue("@Notes", request.Notes ?? "");

                    con.Open();

                    int rows = cmd.ExecuteNonQuery();

                    if (rows == 0)
                        return NotFound(new { message = "Support request not found" });
                }

                return Ok(new { message = "Support request updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        // ============================================================
        // DELETE SUPPORT REQUEST
        // ============================================================
        [HttpDelete("DeleteSupportRequest/{id}")]
        public IActionResult DeleteSupportRequest(int id)
        {
            string query = "DELETE FROM tbl_support_requests WHERE id = @Id";

            try
            {
                using (var con = GetConnection())
                using (var cmd = new MySqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@Id", id);

                    con.Open();

                    int rows = cmd.ExecuteNonQuery();

                    if (rows == 0)
                        return NotFound(new { message = "Support request not found" });
                }

                return Ok(new { message = "Support request deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}