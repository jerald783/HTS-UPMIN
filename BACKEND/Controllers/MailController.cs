

using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;
using BACKEND.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MailController : ControllerBase
    {
        private readonly SmtpService _smtpService;

        public MailController(SmtpService smtpService)
        {
            _smtpService = smtpService;
        }

        [HttpPost("send")]
        public IActionResult SendEmail([FromBody] EmailPayloadModel payload)
        {
            try
            {
                var smtp = _smtpService.GetSmtpSettings();

                using var client = new SmtpClient(smtp.Server, smtp.Port)
                {
                    Credentials = new NetworkCredential(smtp.Username, smtp.Password),
                    EnableSsl = smtp.EnableSsl
                };

                // Send to customer
                if (!string.IsNullOrWhiteSpace(payload.To) && !string.IsNullOrWhiteSpace(smtp.SenderEmail))
                {
                    var userMsg = new MailMessage
                    {
                        From = new MailAddress(smtp.SenderEmail, smtp.SenderName),
                        Subject = payload.Subject,
                        Body = payload.Body,
                        IsBodyHtml = true
                    };

                    userMsg.To.Add(payload.To);
                    client.Send(userMsg);
                }
                // Send to agents
                if (payload.Agents != null && payload.Agents.Any() && !string.IsNullOrWhiteSpace(smtp.SenderEmail))
                {
                    foreach (var agent in payload.Agents)
                    {
                        var agentMsg = new MailMessage
                        {
                            From = new MailAddress(smtp.SenderEmail, smtp.SenderName),
                            Subject = payload.AgentSubject ?? payload.Subject,
                            Body = payload.AgentBody ?? payload.Body,
                            IsBodyHtml = true
                        };

                        agentMsg.To.Add(agent);
                        client.Send(agentMsg);
                    }
                }
                return Ok(new { message = "✅ Email sent to customer and agents." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "❌ Failed to send emails.", error = ex.Message });
            }
        }
    }
}
