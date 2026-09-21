using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using BACKEND.Services;
using System.Text;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/Ticket")]
    public class TicketAnalyzerController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly OllamaAnalyzerService _analyzerService;

        public TicketAnalyzerController(
            IConfiguration configuration, 
            OllamaAnalyzerService analyzerService)
        {
            _configuration = configuration;
            _analyzerService = analyzerService;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_configuration.GetConnectionString("InvAppCon"));
        }

// Inside TicketController.cs (Route: api/Ticket)
// [HttpPost("analyze-all")]
// public async Task<IActionResult> AnalyzeAllTicketsDiagnostic()
// {
//     try
//     {
//         var diagnostics = new List<string>();

//         using (var conn = GetConnection())
//         {
//             await conn.OpenAsync();
//             string query = "SELECT Diagnostic_result FROM tbl_tickets WHERE Diagnostic_result IS NOT NULL AND TRIM(Diagnostic_result) != ''";

//             using (var cmd = new MySqlCommand(query, conn))
//             using (var reader = await cmd.ExecuteReaderAsync())
//             {
//                 while (await reader.ReadAsync())
//                 {
//                     diagnostics.Add(reader["Diagnostic_result"].ToString()!);
//                 }
//             }
//         }

//         if (diagnostics.Count == 0)
//         {
//             return BadRequest(new { message = "No diagnostic results found across tickets." });
//         }

//         string analysis = await _analyzerService.AnalyzeAllDiagnosticsAsync(diagnostics);
//         return Ok(new { totalAnalyzed = diagnostics.Count, analysis });
//     }
//     catch (Exception ex)
//     {
//         return StatusCode(500, new { error = ex.GetType().Name, message = ex.Message });
//     }
// }
[HttpPost("analyze-all")]
public async Task<IActionResult> AnalyzeAllTicketsDiagnostic(
    [FromQuery] DateTime? fromDate, 
    [FromQuery] DateTime? toDate)
{
    try
    {
        var diagnostics = new List<string>();

        using (var conn = GetConnection())
        {
            await conn.OpenAsync();

            var queryBuilder = new StringBuilder(
                "SELECT Diagnostic_result FROM tbl_tickets WHERE Diagnostic_result IS NOT NULL AND TRIM(Diagnostic_result) != ''"
            );

            if (fromDate.HasValue)
            {
                queryBuilder.Append(" AND LastUpdated >= @FromDate");
            }
            if (toDate.HasValue)
            {
                queryBuilder.Append(" AND LastUpdated <= @ToDate");
            }

            using (var cmd = new MySqlCommand(queryBuilder.ToString(), conn))
            {
                if (fromDate.HasValue)
                    cmd.Parameters.AddWithValue("@FromDate", fromDate.Value.Date);

                if (toDate.HasValue)
                    cmd.Parameters.AddWithValue("@ToDate", toDate.Value.Date.AddDays(1).AddTicks(-1));

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var value = reader["Diagnostic_result"]?.ToString();
                        if (!string.IsNullOrWhiteSpace(value))
                        {
                            diagnostics.Add(value);
                        }
                    }
                }
            }
        }

        // Return 200 OK even if 0 items are found to avoid HTTP 400 console errors
        if (diagnostics.Count == 0)
        {
            return Ok(new { 
                totalAnalyzed = 0, 
                analysis = "No diagnostic results were found for the selected date range." 
            });
        }

        string analysis = await _analyzerService.AnalyzeAllDiagnosticsAsync(diagnostics);
        return Ok(new { totalAnalyzed = diagnostics.Count, analysis });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = ex.GetType().Name, message = ex.Message });
    }
}

    }
}