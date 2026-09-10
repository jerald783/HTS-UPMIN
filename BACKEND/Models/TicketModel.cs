using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BACKEND.Models
{
    public class TicketModel
    {
        public int TicketId { get; set; }
        public string? TicketNumber { get; set; }
        public string? PropNo { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public DateTime? RequestDate { get; set; }
        public string? HelpTopic { get; set; }
        public string? IssueDesc { get; set; }
        public string? Location { get; set; }
        public string? PriorityLevel { get; set; }
        public string? CurrentStatus { get; set; }
        public DateTime? LastUpdated { get; set; }
        public DateTime? DueDate { get; set; }
        public bool Overdue { get; set; }
        public string? AgentAssigned { get; set; }
        public List<IFormFile> Files { get; set; } = new();
        public string? ExtraFields { get; set; } // JSON
    }

    public class TicketStatusModel
    {
        public string? CurrentStatus { get; set; }
        public string? AgentAssigned { get; set; }
    }

    public class AssignAgentDto
    {
        public string? AgentAssigned { get; set; }
    }
    public class SupportRequestModel
    {
        public int Id { get; set; }

        public string? Name { get; set; }

        public string? UpEmail { get; set; }

        public DateTime RequestDate { get; set; }

        public string? Category { get; set; }

        public string? CourseDept { get; set; }

        public string? Concern { get; set; }

        public string? Status { get; set; }

        public string? Username { get; set; }

        public string? Password { get; set; }

        public DateTime? DateResolved { get; set; }

        public string? Notes { get; set; }
    }


}