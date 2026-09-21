using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace BACKEND.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessageToGroup(string ticketId, object message)
        {
            await Clients.Group(ticketId).SendAsync("ReceiveMessage", message);
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            
            // Safe null checks for HttpContext and explicit string conversion
            string? ticketId = httpContext?.Request.Query["ticketId"].ToString();

            if (!string.IsNullOrEmpty(ticketId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, ticketId);
            }

            await base.OnConnectedAsync();
        }
    }
}