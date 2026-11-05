using System;
using System.Collections.Generic;

namespace BACKEND.Models
{
    public class MaintenanceItemModel
    {
        public long Id { get; set; }
        public long PmLogId { get; set; }
        public string PropertyTag { get; set; } = string.Empty;
        public string SerialNumber { get; set; } = string.Empty;
        public string DeviceModel { get; set; } = string.Empty;
        public bool Hw { get; set; }
        public bool Os { get; set; }
        public bool Sec { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Remarks { get; set; } = string.Empty;
    }

    public class SignaturesModel
    {
        public string TechName { get; set; } = string.Empty;
        public string? TechDate { get; set; }
        public string? TechSignatureBase64 { get; set; }
        public string CustodianName { get; set; } = string.Empty;
        public string? CustodianDate { get; set; }
        public string? CustodianSignatureBase64 { get; set; }
    }

    public class PmLogModel
    {
        public long Id { get; set; }
        public string DocumentCode { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string BuildingRoom { get; set; } = string.Empty;
        public string Custodian { get; set; } = string.Empty;
        public string ServicingDate { get; set; } = string.Empty;
        public string MaintenanceClass { get; set; } = string.Empty;
        public List<MaintenanceItemModel> Items { get; set; } = new();
        public SignaturesModel Signatures { get; set; } = new();
    }
}