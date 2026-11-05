namespace BACKEND.Models
{
    public class TicketExtraFieldModel
    {
        public int Id { get; set; }
        public string? FieldName { get; set; }
        public string?  FieldLabel { get; set; }
        public string?  FieldType { get; set; }
        public string? Options { get; set; }
        public bool IsRequired { get; set; }
    }
}