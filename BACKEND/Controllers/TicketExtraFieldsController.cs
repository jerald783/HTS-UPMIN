using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Data;
using BACKEND.Models;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketExtraFieldsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public TicketExtraFieldsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(_configuration.GetConnectionString("InvAppCon"));
        }

        [HttpGet]
        public async Task<IActionResult> GetFields()
        {
            string query = "SELECT * FROM tbl_ticket_extra_fields WHERE IsActive=1";

            DataTable table = new();

            using var con = GetConnection();
            using var cmd = new MySqlCommand(query, con);

            await con.OpenAsync();
            using var reader = await cmd.ExecuteReaderAsync();

            table.Load(reader);

            return Ok(table);
        }

        [HttpPost]
        public async Task<IActionResult> AddField([FromBody] TicketExtraFieldModel field)
        {
            string query = @"INSERT INTO tbl_ticket_extra_fields
                            (FieldName,FieldLabel,FieldType,Options,IsRequired)
                            VALUES
                            (@FieldName,@FieldLabel,@FieldType,@Options,@IsRequired)";

            using var con = GetConnection();
            using var cmd = new MySqlCommand(query, con);

            cmd.Parameters.AddWithValue("@FieldName", field.FieldName);
            cmd.Parameters.AddWithValue("@FieldLabel", field.FieldLabel);
            cmd.Parameters.AddWithValue("@FieldType", field.FieldType);
            cmd.Parameters.AddWithValue("@Options", field.Options);
            cmd.Parameters.AddWithValue("@IsRequired", field.IsRequired);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteField(int id)
        {
            string query = "DELETE FROM tbl_ticket_extra_fields WHERE Id=@Id";

            using var con = GetConnection();
            using var cmd = new MySqlCommand(query, con);

            cmd.Parameters.AddWithValue("@Id", id);

            await con.OpenAsync();
            await cmd.ExecuteNonQueryAsync();

            return Ok();
        }
    }
}