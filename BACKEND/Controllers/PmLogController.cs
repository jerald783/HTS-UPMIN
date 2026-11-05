using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using BACKEND.Models;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PmLogController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public PmLogController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_configuration.GetConnectionString("InvAppCon"));
        }

        [HttpGet]
        public IActionResult Get()
        {
            string query = @"SELECT 
                                id AS Id, 
                                document_code AS DocumentCode, 
                                department AS Department, 
                                building_room AS BuildingRoom, 
                                custodian AS Custodian, 
                                DATE_FORMAT(servicing_date, '%Y-%m-%d') AS ServicingDate, 
                                maintenance_class AS MaintenanceClass, 
                                tech_name AS TechName, 
                                DATE_FORMAT(tech_date, '%Y-%m-%d') AS TechDate, 
                                custodian_name AS CustodianName, 
                                DATE_FORMAT(custodian_date, '%Y-%m-%d') AS CustodianDate 
                             FROM `pm-log` 
                             ORDER BY id DESC";

            DataTable table = new();
            try
            {
                using (var con = GetConnection())
                {
                    using (var cmd = new MySqlCommand(query, con))
                    {
                        con.Open();
                        using (var reader = cmd.ExecuteReader())
                        {
                            table.Load(reader);
                        }
                    }
                }
                return Ok(table);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetById(long id)
        {
            string headerQuery = @"SELECT 
                                    id AS Id, 
                                    document_code AS DocumentCode, 
                                    department AS Department, 
                                    building_room AS BuildingRoom, 
                                    custodian AS Custodian, 
                                    DATE_FORMAT(servicing_date, '%Y-%m-%d') AS ServicingDate, 
                                    maintenance_class AS MaintenanceClass, 
                                    tech_name AS TechName, 
                                    DATE_FORMAT(tech_date, '%Y-%m-%d') AS TechDate, 
                                    tech_signature_base64 AS TechSignatureBase64,
                                    custodian_name AS CustodianName, 
                                    DATE_FORMAT(custodian_date, '%Y-%m-%d') AS CustodianDate,
                                    custodian_signature_base64 AS CustodianSignatureBase64
                                 FROM `pm-log` 
                                 WHERE id = @id";

            string itemsQuery = @"SELECT 
                                    id AS Id, 
                                    pm_log_id AS PmLogId, 
                                    property_tag AS PropertyTag, 
                                    serial_number AS SerialNumber, 
                                    device_model AS DeviceModel, 
                                    hw AS Hw, 
                                    os AS Os, 
                                    sec AS Sec, 
                                    status AS Status, 
                                    remarks AS Remarks 
                                 FROM `pm-log-items` 
                                 WHERE pm_log_id = @id";

            try
            {
                using (var con = GetConnection())
                {
                    con.Open();

                    PmLogModel result = new();

                    using (var cmd = new MySqlCommand(headerQuery, con))
                    {
                        cmd.Parameters.AddWithValue("@id", id);
                        using (var reader = cmd.ExecuteReader())
                        {
                            if (!reader.HasRows) return NotFound(new { message = "PM Log record not found." });

                            while (reader.Read())
                            {
                                result.Id = Convert.ToInt64(reader["Id"]);
                                result.DocumentCode = reader["DocumentCode"]?.ToString() ?? "";
                                result.Department = reader["Department"]?.ToString() ?? "";
                                result.BuildingRoom = reader["BuildingRoom"]?.ToString() ?? "";
                                result.Custodian = reader["Custodian"]?.ToString() ?? "";
                                result.ServicingDate = reader["ServicingDate"]?.ToString() ?? "";
                                result.MaintenanceClass = reader["MaintenanceClass"]?.ToString() ?? "";
                                result.Signatures = new SignaturesModel
                                {
                                    TechName = reader["TechName"]?.ToString() ?? "",
                                    TechDate = reader["TechDate"]?.ToString() ?? "",
                                    TechSignatureBase64 = reader["TechSignatureBase64"]?.ToString() ?? "",
                                    CustodianName = reader["CustodianName"]?.ToString() ?? "",
                                    CustodianDate = reader["CustodianDate"]?.ToString() ?? "",
                                    CustodianSignatureBase64 = reader["CustodianSignatureBase64"]?.ToString() ?? ""
                                };
                            }
                        }
                    }

                    using (var cmdItems = new MySqlCommand(itemsQuery, con))
                    {
                        cmdItems.Parameters.AddWithValue("@id", id);
                        using (var readerItems = cmdItems.ExecuteReader())
                        {
                            while (readerItems.Read())
                            {
                                result.Items.Add(new MaintenanceItemModel
                                {
                                    Id = Convert.ToInt64(readerItems["Id"]),
                                    PmLogId = Convert.ToInt64(readerItems["PmLogId"]),
                                    PropertyTag = readerItems["PropertyTag"]?.ToString() ?? "",
                                    SerialNumber = readerItems["SerialNumber"]?.ToString() ?? "",
                                    DeviceModel = readerItems["DeviceModel"]?.ToString() ?? "",
                                    Hw = Convert.ToBoolean(readerItems["Hw"]),
                                    Os = Convert.ToBoolean(readerItems["Os"]),
                                    Sec = Convert.ToBoolean(readerItems["Sec"]),
                                    Status = readerItems["Status"]?.ToString() ?? "",
                                    Remarks = readerItems["Remarks"]?.ToString() ?? ""
                                });
                            }
                        }
                    }

                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPost]
        public IActionResult Post(PmLogModel model)
        {
            string insertHeaderQuery = @"INSERT INTO `pm-log`
                (document_code, department, building_room, custodian, servicing_date, maintenance_class, 
                 tech_name, tech_date, tech_signature_base64, custodian_name, custodian_date, custodian_signature_base64)
                VALUES 
                (@DocumentCode, @Department, @BuildingRoom, @Custodian, @ServicingDate, @MaintenanceClass, 
                 @TechName, @TechDate, @TechSignatureBase64, @CustodianName, @CustodianDate, @CustodianSignatureBase64);
                SELECT LAST_INSERT_ID();";

            string insertItemQuery = @"INSERT INTO `pm-log-items`
                (pm_log_id, property_tag, serial_number, device_model, hw, os, sec, status, remarks)
                VALUES 
                (@PmLogId, @PropertyTag, @SerialNumber, @DeviceModel, @Hw, @Os, @Sec, @Status, @Remarks);";

            try
            {
                using (var con = GetConnection())
                {
                    con.Open();
                    using (var transaction = con.BeginTransaction())
                    {
                        long newId = 0;
                        using (var cmd = new MySqlCommand(insertHeaderQuery, con, transaction))
                        {
                            cmd.Parameters.AddWithValue("@DocumentCode", model.DocumentCode);
                            cmd.Parameters.AddWithValue("@Department", model.Department);
                            cmd.Parameters.AddWithValue("@BuildingRoom", model.BuildingRoom);
                            cmd.Parameters.AddWithValue("@Custodian", model.Custodian);
                            cmd.Parameters.AddWithValue("@ServicingDate", DateTime.TryParse(model.ServicingDate, out var sDate) ? sDate : DBNull.Value);
                            cmd.Parameters.AddWithValue("@MaintenanceClass", model.MaintenanceClass);
                            cmd.Parameters.AddWithValue("@TechName", model.Signatures?.TechName);
                            cmd.Parameters.AddWithValue("@TechDate", DateTime.TryParse(model.Signatures?.TechDate, out var tDate) ? tDate : DBNull.Value);
                            cmd.Parameters.AddWithValue("@TechSignatureBase64", model.Signatures?.TechSignatureBase64);
                            cmd.Parameters.AddWithValue("@CustodianName", model.Signatures?.CustodianName);
                            cmd.Parameters.AddWithValue("@CustodianDate", DateTime.TryParse(model.Signatures?.CustodianDate, out var cDate) ? cDate : DBNull.Value);
                            cmd.Parameters.AddWithValue("@CustodianSignatureBase64", model.Signatures?.CustodianSignatureBase64);

                            newId = Convert.ToInt64(cmd.ExecuteScalar());
                        }

                        if (model.Items != null && model.Items.Count > 0)
                        {
                            foreach (var item in model.Items)
                            {
                                using (var cmdItem = new MySqlCommand(insertItemQuery, con, transaction))
                                {
                                    cmdItem.Parameters.AddWithValue("@PmLogId", newId);
                                    cmdItem.Parameters.AddWithValue("@PropertyTag", item.PropertyTag ?? "");
                                    cmdItem.Parameters.AddWithValue("@SerialNumber", item.SerialNumber ?? "");
                                    cmdItem.Parameters.AddWithValue("@DeviceModel", item.DeviceModel ?? "");
                                    cmdItem.Parameters.AddWithValue("@Hw", item.Hw);
                                    cmdItem.Parameters.AddWithValue("@Os", item.Os);
                                    cmdItem.Parameters.AddWithValue("@Sec", item.Sec);
                                    cmdItem.Parameters.AddWithValue("@Status", item.Status ?? "");
                                    cmdItem.Parameters.AddWithValue("@Remarks", item.Remarks ?? "");
                                    cmdItem.ExecuteNonQuery();
                                }
                            }
                        }

                        transaction.Commit();
                        return Ok(new { message = "Added Successfully", id = newId });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpPut]
        public IActionResult Put(PmLogModel model)
        {
            string updateHeaderQuery = @"UPDATE `pm-log` SET 
                document_code = @DocumentCode,
                department = @Department,
                building_room = @BuildingRoom,
                custodian = @Custodian,
                servicing_date = @ServicingDate,
                maintenance_class = @MaintenanceClass,
                tech_name = @TechName,
                tech_date = @TechDate,
                tech_signature_base64 = @TechSignatureBase64,
                custodian_name = @CustodianName,
                custodian_date = @CustodianDate,
                custodian_signature_base64 = @CustodianSignatureBase64
                WHERE id = @Id";

            string deleteItemsQuery = "DELETE FROM `pm-log-items` WHERE pm_log_id = @Id";

            string insertItemQuery = @"INSERT INTO `pm-log-items`
                (pm_log_id, property_tag, serial_number, device_model, hw, os, sec, status, remarks)
                VALUES 
                (@PmLogId, @PropertyTag, @SerialNumber, @DeviceModel, @Hw, @Os, @Sec, @Status, @Remarks)";

            try
            {
                using (var con = GetConnection())
                {
                    con.Open();
                    using (var transaction = con.BeginTransaction())
                    {
                        using (var cmd = new MySqlCommand(updateHeaderQuery, con, transaction))
                        {
                            cmd.Parameters.AddWithValue("@Id", model.Id);
                            cmd.Parameters.AddWithValue("@DocumentCode", model.DocumentCode);
                            cmd.Parameters.AddWithValue("@Department", model.Department);
                            cmd.Parameters.AddWithValue("@BuildingRoom", model.BuildingRoom);
                            cmd.Parameters.AddWithValue("@Custodian", model.Custodian);
                            cmd.Parameters.AddWithValue("@ServicingDate", DateTime.TryParse(model.ServicingDate, out var sDate) ? sDate : DBNull.Value);
                            cmd.Parameters.AddWithValue("@MaintenanceClass", model.MaintenanceClass);
                            cmd.Parameters.AddWithValue("@TechName", model.Signatures?.TechName);
                            cmd.Parameters.AddWithValue("@TechDate", DateTime.TryParse(model.Signatures?.TechDate, out var tDate) ? tDate : DBNull.Value);
                            cmd.Parameters.AddWithValue("@TechSignatureBase64", model.Signatures?.TechSignatureBase64);
                            cmd.Parameters.AddWithValue("@CustodianName", model.Signatures?.CustodianName);
                            cmd.Parameters.AddWithValue("@CustodianDate", DateTime.TryParse(model.Signatures?.CustodianDate, out var cDate) ? cDate : DBNull.Value);
                            cmd.Parameters.AddWithValue("@CustodianSignatureBase64", model.Signatures?.CustodianSignatureBase64);

                            int rowsAffected = cmd.ExecuteNonQuery();
                            if (rowsAffected == 0)
                            {
                                transaction.Rollback();
                                return NotFound(new { message = "No record found with that Id" });
                            }
                        }

                        using (var deleteCmd = new MySqlCommand(deleteItemsQuery, con, transaction))
                        {
                            deleteCmd.Parameters.AddWithValue("@Id", model.Id);
                            deleteCmd.ExecuteNonQuery();
                        }

                        if (model.Items != null && model.Items.Count > 0)
                        {
                            foreach (var item in model.Items)
                            {
                                using (var itemCmd = new MySqlCommand(insertItemQuery, con, transaction))
                                {
                                    itemCmd.Parameters.AddWithValue("@PmLogId", model.Id);
                                    itemCmd.Parameters.AddWithValue("@PropertyTag", item.PropertyTag ?? "");
                                    itemCmd.Parameters.AddWithValue("@SerialNumber", item.SerialNumber ?? "");
                                    itemCmd.Parameters.AddWithValue("@DeviceModel", item.DeviceModel ?? "");
                                    itemCmd.Parameters.AddWithValue("@Hw", item.Hw);
                                    itemCmd.Parameters.AddWithValue("@Os", item.Os);
                                    itemCmd.Parameters.AddWithValue("@Sec", item.Sec);
                                    itemCmd.Parameters.AddWithValue("@Status", item.Status ?? "");
                                    itemCmd.Parameters.AddWithValue("@Remarks", item.Remarks ?? "");
                                    itemCmd.ExecuteNonQuery();
                                }
                            }
                        }

                        transaction.Commit();
                        return Ok(new { message = "Updated Successfully" });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(long id)
        {
            string query = "DELETE FROM `pm-log` WHERE id = @Id";

            try
            {
                using (var con = GetConnection())
                {
                    using (var cmd = new MySqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@Id", id);
                        con.Open();
                        int rowsAffected = cmd.ExecuteNonQuery();
                        if (rowsAffected > 0)
                            return Ok(new { message = "Deleted Successfully" });
                        else
                            return NotFound(new { message = "No record found with that Id" });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}