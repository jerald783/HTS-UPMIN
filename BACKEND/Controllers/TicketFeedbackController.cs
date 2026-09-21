


using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System.Data;
using BACKEND.Models;
using System;
using System.IO;
using System.Text.RegularExpressions;
using BACKEND.Models.BACKEND.Models;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketFeedbackController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public TicketFeedbackController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_configuration.GetConnectionString("InvAppCon"));
        }

        [HttpPost]
        public IActionResult Post(FeedbackModel feedback)
        {
            try
            {
                var base64Data = Regex.Replace(feedback.SignatureImagePath ?? "", @"^data:image\/[a-zA-Z]+;base64,", "");
                byte[] imageBytes = Convert.FromBase64String(base64Data);

                var assetsPath = Path.Combine(Directory.GetCurrentDirectory(), "Assets/E-sig/");
                if (!Directory.Exists(assetsPath)) Directory.CreateDirectory(assetsPath);

                string fileName = $"signature_{Guid.NewGuid()}.png";
                string filePath = Path.Combine(assetsPath, fileName);
                System.IO.File.WriteAllBytes(filePath, imageBytes);
                string signatureUrl = $"/Assets/E-sig/{fileName}";

                string query = @"
INSERT INTO tbl_ticketfeedback 
(TicketNumber, CompanyName, Unit, FullName, Email, Phone, SupportAgent, IssueType, SupportChannel, OtherIssue, DateRequested, DateResolved, FeedbackText, Rating, ResponseTime, TechnicalKnowledge, Professionalism, Communication, Resolution, Signature)
VALUES 
(@TicketNumber, @CompanyName, @Unit, @FullName, @Email, @Phone, @SupportAgent, @IssueType, @SupportChannel, @OtherIssue, @DateRequested, @DateResolved, @FeedbackText, @Rating, @ResponseTime, @TechnicalKnowledge, @Professionalism, @Communication, @Resolution, @SignatureUrl)";

                using (var con = GetConnection())
                {
                    using (var cmd = new MySqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@TicketNumber", feedback.TicketNumber ?? "");
                        cmd.Parameters.AddWithValue("@CompanyName", feedback.CompanyName ?? "");
                        cmd.Parameters.AddWithValue("@Unit", feedback.Unit ?? "");
                        cmd.Parameters.AddWithValue("@FullName", feedback.FullName ?? "");
                        cmd.Parameters.AddWithValue("@Email", feedback.Email ?? "");
                        cmd.Parameters.AddWithValue("@Phone", feedback.Phone ?? "");
                        cmd.Parameters.AddWithValue("@SupportAgent", feedback.SupportAgent ?? "");
                        cmd.Parameters.AddWithValue("@IssueType", feedback.IssueType ?? "");
                        cmd.Parameters.AddWithValue("@SupportChannel", feedback.SupportChannel ?? "");
                        cmd.Parameters.AddWithValue("@OtherIssue", feedback.OtherIssue ?? "");

                        //  Both dates
                        cmd.Parameters.AddWithValue("@DateRequested", feedback.DateRequested == default(DateTime) ? DBNull.Value : feedback.DateRequested);
                        cmd.Parameters.AddWithValue("@DateResolved", feedback.DateResolved == default(DateTime) ? DBNull.Value : feedback.DateResolved);

                        cmd.Parameters.AddWithValue("@FeedbackText", feedback.FeedbackText ?? "");
                        cmd.Parameters.AddWithValue("@Rating", feedback.Rating);
                        cmd.Parameters.AddWithValue("@ResponseTime", feedback.RatingsDetail?.responseTime ?? "");
                        cmd.Parameters.AddWithValue("@TechnicalKnowledge", feedback.RatingsDetail?.technicalKnowledge ?? "");
                        cmd.Parameters.AddWithValue("@Professionalism", feedback.RatingsDetail?.professionalism ?? "");
                        cmd.Parameters.AddWithValue("@Communication", feedback.RatingsDetail?.communication ?? "");
                        cmd.Parameters.AddWithValue("@Resolution", feedback.RatingsDetail?.resolution ?? "");
                        cmd.Parameters.AddWithValue("@SignatureUrl", signatureUrl);

                        con.Open();
                        cmd.ExecuteNonQuery();
                    }
                }

                return Ok(new { message = "✅ Feedback submitted successfully", signatureUrl });
            }
            catch (Exception ex)
            {
                Console.WriteLine("❌ Error saving feedback: " + ex);
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }


        [HttpGet("byUser/{email}")]
        public IActionResult GetByUser(string email)
        {
            string query = @"
        SELECT 
            TicketNumber
        FROM tbl_ticketfeedback
        WHERE Email = @Email
    ";

            DataTable table = new();

            try
            {
                using (var con = GetConnection())
                {
                    using (var cmd = new MySqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@Email", email);
                        con.Open();
                        using (var reader = cmd.ExecuteReader())
                        {
                            table.Load(reader);
                        }
                    }
                }

                return Ok(table);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        //         [HttpGet("stats")]
        // public IActionResult GetFeedbackStats([FromQuery] string? fromDate, [FromQuery] string? toDate)
        // {
        //     string query = @"
        //         SELECT 
        //             YEAR(DateRequested) AS Year,
        //             MONTH(DateRequested) AS Month,
        //             SupportAgent,
        //             COUNT(*) AS TotalFeedbacks,
        //             AVG(CAST(Rating AS DECIMAL(3,2))) AS AvgRating,
        //             AVG(CASE WHEN ResponseTime = 'Excellent' THEN 5 WHEN ResponseTime = 'Good' THEN 4 WHEN ResponseTime = 'Average' THEN 3 ELSE 2 END) AS AvgResponseTime,
        //             AVG(CASE WHEN TechnicalKnowledge = 'Excellent' THEN 5 WHEN TechnicalKnowledge = 'Good' THEN 4 WHEN TechnicalKnowledge = 'Average' THEN 3 ELSE 2 END) AS AvgTechnicalKnowledge,
        //             AVG(CASE WHEN Professionalism = 'Excellent' THEN 5 WHEN Professionalism = 'Good' THEN 4 WHEN Professionalism = 'Average' THEN 3 ELSE 2 END) AS AvgProfessionalism,
        //             AVG(CASE WHEN Communication = 'Excellent' THEN 5 WHEN Communication = 'Good' THEN 4 WHEN Communication = 'Average' THEN 3 ELSE 2 END) AS AvgCommunication,
        //             AVG(CASE WHEN Resolution = 'Excellent' THEN 5 WHEN Resolution = 'Good' THEN 4 WHEN Resolution = 'Average' THEN 3 ELSE 2 END) AS AvgResolution
        //         FROM tbl_ticketfeedback
        //         WHERE DateRequested IS NOT NULL";

        //     if (!string.IsNullOrEmpty(fromDate)) query += " AND DateRequested >= @FromDate";
        //     if (!string.IsNullOrEmpty(toDate)) query += " AND DateRequested <= @ToDate";

        //     query += " GROUP BY YEAR(DateRequested), MONTH(DateRequested), SupportAgent ORDER BY Year DESC, Month DESC;";

        //     DataTable table = new();
        //     try
        //     {
        //         using (var con = GetConnection())
        //         using (var cmd = new MySqlCommand(query, con))
        //         {
        //             if (!string.IsNullOrEmpty(fromDate)) cmd.Parameters.AddWithValue("@FromDate", fromDate);
        //             if (!string.IsNullOrEmpty(toDate)) cmd.Parameters.AddWithValue("@ToDate", toDate);

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

        [HttpGet("stats")]
        public IActionResult GetFeedbackStats([FromQuery] string? fromDate, [FromQuery] string? toDate)
        {
            string query = @"
        SELECT 
            YEAR(DateRequested) AS Year,
            MONTH(DateRequested) AS Month,
            SupportAgent,
            COUNT(*) AS TotalFeedbacks,
            AVG(CAST(Rating AS DECIMAL(3,2))) AS AvgRating,
            AVG(CASE WHEN ResponseTime = 'Excellent' THEN 5 WHEN ResponseTime = 'Good' THEN 4 WHEN ResponseTime = 'Average' THEN 3 ELSE 2 END) AS AvgResponseTime,
            AVG(CASE WHEN TechnicalKnowledge = 'Excellent' THEN 5 WHEN TechnicalKnowledge = 'Good' THEN 4 WHEN TechnicalKnowledge = 'Average' THEN 3 ELSE 2 END) AS AvgTechnicalKnowledge,
            AVG(CASE WHEN Professionalism = 'Excellent' THEN 5 WHEN Professionalism = 'Good' THEN 4 WHEN Professionalism = 'Average' THEN 3 ELSE 2 END) AS AvgProfessionalism,
            AVG(CASE WHEN Communication = 'Excellent' THEN 5 WHEN Communication = 'Good' THEN 4 WHEN Communication = 'Average' THEN 3 ELSE 2 END) AS AvgCommunication,
            AVG(CASE WHEN Resolution = 'Excellent' THEN 5 WHEN Resolution = 'Good' THEN 4 WHEN Resolution = 'Average' THEN 3 ELSE 2 END) AS AvgResolution,
            GROUP_CONCAT(
                CASE 
                    WHEN FeedbackText IS NOT NULL AND FeedbackText != '' 
                    THEN FeedbackText 
                    ELSE NULL 
                END 
                SEPARATOR ' | '
            ) AS FeedbackText
        FROM tbl_ticketfeedback
        WHERE DateRequested IS NOT NULL";

            if (!string.IsNullOrEmpty(fromDate)) query += " AND DateRequested >= @FromDate";
            if (!string.IsNullOrEmpty(toDate)) query += " AND DateRequested <= @ToDate";

            query += " GROUP BY YEAR(DateRequested), MONTH(DateRequested), SupportAgent ORDER BY Year DESC, Month DESC;";

            DataTable table = new();
            try
            {
                using (var con = GetConnection())
                using (var cmd = new MySqlCommand(query, con))
                {
                    if (!string.IsNullOrEmpty(fromDate)) cmd.Parameters.AddWithValue("@FromDate", fromDate);
                    if (!string.IsNullOrEmpty(toDate)) cmd.Parameters.AddWithValue("@ToDate", toDate);

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
    }
}
