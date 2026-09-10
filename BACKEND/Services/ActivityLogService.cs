using MySql.Data.MySqlClient;
using BACKEND.Models;

namespace BACKEND.Services
{
    public class ActivityLogService : IActivityLogService
    {
        private readonly IConfiguration _configuration;

        public ActivityLogService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(
                _configuration.GetConnectionString("InvAppCon"));
        }

        public async Task LogAsync(
            string module,
            string action,
            string description,
            int? userId = null,
            string? userEmail = null,
            string? referenceId = null)
        {
            try 
            {
                string query = @"
                    INSERT INTO tbl_activity_logs
                    (Module, Action, Description, UserId, UserEmail, ReferenceId)
                    VALUES
                    (@Module, @Action, @Description, @UserId, @UserEmail, @ReferenceId)";

                using var con = GetConnection();
                using var cmd = new MySqlCommand(query, con);

                cmd.Parameters.Add("@Module", MySqlDbType.VarChar).Value = module ?? "Unknown";
                cmd.Parameters.Add("@Action", MySqlDbType.VarChar).Value = action ?? "Unknown";
                cmd.Parameters.Add("@Description", MySqlDbType.Text).Value = description ?? "";
                cmd.Parameters.Add("@UserId", MySqlDbType.Int32).Value = userId.HasValue ? userId.Value : DBNull.Value;
                cmd.Parameters.Add("@UserEmail", MySqlDbType.VarChar).Value = userEmail ?? "Unknown";
                cmd.Parameters.Add("@ReferenceId", MySqlDbType.VarChar).Value = referenceId ?? (object)DBNull.Value;

                await con.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                // Prevents database logging failure from halting request execution
                Console.WriteLine($"[ActivityLog Error]: {ex.Message}");
            }
        }
    }
}