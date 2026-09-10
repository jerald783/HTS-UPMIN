using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BACKEND.Models
{
    namespace BACKEND.Models
    {
        public class FeedbackModel
    {
   public int Id { get; set; }
        public string? TicketNumber { get; set; }
        public string? CompanyName { get; set; }       
        public string? Unit { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? SupportAgent { get; set; }
        public string? IssueType { get; set; }        
        public string? SupportChannel { get; set; }   
        public string? OtherIssue { get; set; }
        public DateTime DateRequested { get; set; }   
        public DateTime DateResolved { get; set; }
        public string? FeedbackText { get; set; }
        public int Rating { get; set; }
        public string? SignatureImagePath { get; set; }
        public Ratings? RatingsDetail { get; set; }
    }

    public class Ratings
    {
        public string? responseTime { get; set; }
        public string? technicalKnowledge { get; set; }
        public string? professionalism { get; set; }
        public string? communication { get; set; }
        public string? resolution { get; set; }
    }}

}