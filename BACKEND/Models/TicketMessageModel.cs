namespace BACKEND.Models
{
    public class TicketMessageModel
    {
        public int MessageId { get; set; }
        public int TicketId { get; set; }
        public string? SenderEmail { get; set; }
        public string? Message { get; set; }
        public DateTime Timestamp { get; set; }

                // FILE (optional)
        public string? FileName { get; set; }
        public string? FilePath { get; set; }
        public string? FileType { get; set; }
        public long? FileSize { get; set; }
    }

}
