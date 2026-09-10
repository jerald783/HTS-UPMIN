using Microsoft.AspNetCore.Mvc.Filters;
using BACKEND.Services;
using System.Security.Claims;
using System.Text.Json;

namespace BACKEND.Filters
{
    public class ActivityLogFilter : IAsyncActionFilter
    {
        private readonly IActivityLogService _logService;

        public ActivityLogFilter(IActivityLogService logService)
        {
            _logService = logService;
        }

        public async Task OnActionExecutionAsync(
            ActionExecutingContext context,
            ActionExecutionDelegate next)
        {
            var controller = context.RouteData.Values["controller"]?.ToString();
            var action = context.RouteData.Values["action"]?.ToString();

            // 1. Get User Email from claims
            var userEmail = context.HttpContext.User?.FindFirst(ClaimTypes.Email)?.Value 
                            ?? context.HttpContext.User?.Identity?.Name 
                            ?? "Unknown";

            // 2. Get UserId from claims
            int? userId = null;
            var userIdClaim = context.HttpContext.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                           ?? context.HttpContext.User?.FindFirst("sub")?.Value 
                           ?? context.HttpContext.User?.FindFirst("UserId")?.Value;

            if (int.TryParse(userIdClaim, out int parsedId))
            {
                userId = parsedId;
            }

            // 3. Extract target entity ID / details from Action Arguments
            string referenceId = null;
            string dynamicDetails = BuildDetailedDescription(controller, action, context);

            // Extract reference ID if available in route (e.g. /api/users/21)
            if (context.ActionArguments.TryGetValue("id", out var idVal) && idVal != null)
            {
                referenceId = idVal.ToString();
            }

            // Execute the action
            var executedContext = await next();

            // Log activity after action completes
            if (executedContext.Exception == null)
            {
                await _logService.LogAsync(
                    module: controller ?? "Unknown",
                    action: action ?? "Unknown",
                    description: dynamicDetails,
                    userId: userId,
                    userEmail: userEmail,
                    referenceId: referenceId
                );
            }
        }

private string BuildDetailedDescription(string controller, string action, ActionExecutingContext context)
{
    // Extract 'id' if present in route/action arguments
    context.ActionArguments.TryGetValue("id", out var idObj);
    string idText = idObj != null ? $" #{idObj}" : "";

    // 1. Format the action phrase cleanly (e.g., "Updated User #24" or "User #24")
    string formattedController = controller?.TrimEnd('s') ?? "Item";
    string actionHeader = $"Updated {formattedController}{idText}";

    // 2. Extract non-null model properties
    var changedFields = new List<string>();

    foreach (var arg in context.ActionArguments.Values)
    {
        if (arg == null) continue;

        var type = arg.GetType();
        
        // Check if argument is a complex model/DTO (class, not string/primitive)
        if (type.IsClass && type != typeof(string))
        {
            var nonNullProps = type.GetProperties()
                .Where(p => p.Name.ToLower() != "id") // Exclude ID from fields list
                .Where(p => p.GetValue(arg) != null)
                .Select(p => p.Name);

            changedFields.AddRange(nonNullProps);
        }
    }

    // 3. Join cleanly without trailing commas
    string fieldsText = changedFields.Any() 
        ? $" | {string.Join(", ", changedFields)}" 
        : "";

    return $"{actionHeader}{fieldsText}";
}
        private string GetObjectPropertiesOrName(object arg)
        {
            // If the argument is a complex model/DTO passed in request body
            var type = arg.GetType();
            if (type.IsClass && type != typeof(string))
            {
                // Gets non-null property names from the DTO sent by client
                var nonNullProps = type.GetProperties()
                    .Where(p => p.GetValue(arg) != null)
                    .Select(p => p.Name);

                return string.Join(", ", nonNullProps);
            }

            return arg.ToString();
        }
    }
}