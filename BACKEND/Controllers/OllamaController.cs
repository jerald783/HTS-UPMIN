using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BACKEND.Models;
using BACKEND.Services;
using Microsoft.AspNetCore.Mvc;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OllamaController : ControllerBase
    {
        private readonly OllamaService _ollama;

       public OllamaController(OllamaService ollama)
        {
            _ollama = ollama;
        }

       [HttpPost("AnalyzeTicket")]
public async Task<IActionResult> AnalyzeTicket([FromBody] AiTicketRequest request)
{
    try
    {
        Console.WriteLine("ISSUE RECEIVED: " + request.Issue);

        var result = await _ollama.AnalyzeTicket(request.Issue);

        return Ok(new { analysis = result });
    }
    catch (Exception ex)
    {
        Console.WriteLine(ex);
        return StatusCode(500, ex.Message);
    }
}


//       [HttpPost("AnalyzeTicket")]
// public async Task<IActionResult> AnalyzeTicket([FromBody] AiTicketRequest request)
// {
//     if (string.IsNullOrWhiteSpace(request.Issue))
//         return BadRequest("Issue cannot be empty");

//     try
//     {
//         var result = await _ollama.AnalyzeTicket(request.Issue);
//         Console.WriteLine("AI Response: " + result); // Log actual response
//         return Ok(new { analysis = result }); // Make sure Angular expects 'analysis'
//     }
//     catch (Exception ex)
//     {
//         Console.WriteLine("AI Error: " + ex);
//         return StatusCode(500, new { error = ex.Message });
//     }
// }  
        // ============================================================
        // GET ALL TICKETS
        // ============================================================
       
        
    }
}