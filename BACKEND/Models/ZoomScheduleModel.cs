namespace BACKEND.Models
{
    public class ZoomScheduleModel
    {
        public int Id { get; set; }
        public DateTime Timestamp { get; set; }

        public string? ActivityName { get; set; }
        public string? SetupType { get; set; }
        public string? ZoomDescription { get; set; }

        // Legacy / single-day
        public DateTime? EventDate { get; set; }

        // Multi-day support
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public TimeSpan TimeStart { get; set; }
        public TimeSpan TimeEnd { get; set; }

        public string? AlternateHosts { get; set; }
        public string? RequireRegistration { get; set; }
        public string? DesiredPasscode { get; set; }
        public string? RequesterName { get; set; }
        public string? RequesterEmail { get; set; }
        public string? OfficeUnitProject { get; set; }
        public string? AdditionalDetails { get; set; }

        public int Score { get; set; }
        public string? EmailAddress { get; set; }
        public string? ConfigFile { get; set; }

        public DateTime? DateAddressed { get; set; }
        public string? Status { get; set; }
        
    }
}
