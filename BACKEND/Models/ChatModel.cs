using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BACKEND.Models
{
    public class ChatModel
    {
        
    }
    public class ReadTicketRequest
{
    public int TicketId { get; set; }
    public string Email { get; set; } = "";
}
        public class ChatUploadRequest
        {
            public int TicketId { get; set; }
            public string SenderEmail { get; set; } = "";
            public string? Message { get; set; }
            public IFormFile? File { get; set; }
        }
}