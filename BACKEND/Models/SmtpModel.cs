using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BACKEND.Models
{
    public class SmtpModel
    {
         [Required]
        public string Server { get; set; } = string.Empty;

        [Required]
        [Range(1, 65535, ErrorMessage = "Invalid Port Range.")]
        public int Port { get; set; }

        [Required]
        public string SenderName { get; set; } = string.Empty;

        [Required]
        [EmailAddress(ErrorMessage = "Invalid Sender Email Address.")]
        public string SenderEmail { get; set; } = string.Empty;

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        public bool EnableSsl { get; set; } 
    }
}