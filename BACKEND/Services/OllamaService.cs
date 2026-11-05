

// using System.Text;
// using System.Text.Json;
// using System.Net.Http.Json;
// using System.Text.RegularExpressions;
// using BACKEND.Models;

// namespace BACKEND.Services
// {
//     public class OllamaService
//     {
//         private readonly HttpClient _httpClient;
//         private readonly ILogger<OllamaService> _logger;

//         private const string OllamaEndpoint = "api/generate";
//         // private const string ModelName = "qwen2.5:1.5b"; 
//         private const string ModelName = "qwen:latest";
//         public OllamaService(HttpClient httpClient, ILogger<OllamaService> logger)
//         {
//             _httpClient = httpClient;
//             _logger = logger;
//             _httpClient.Timeout = TimeSpan.FromMinutes(5);
//         }

//         public async Task<string> AnalyzeTicket(string issue)
//         {
//             // Step 1: Validate input
//             if (string.IsNullOrWhiteSpace(issue))
//                 return "Please describe the issue.";

//             // Step 2: Limit prompt size
//             if (issue.Length > 500)
//                 issue = issue.Substring(0, 500);

//             // Step 3: Only allow ICT issues
//             if (!IsIctIssue(issue))
//                 return "This assistant only supports basic ICT equipment troubleshooting.";

//             // Step 4: Check for unauthorized actions
//             if (IsUnauthorizedAction(issue))
//                 return HandleUnauthorizedAction();

//             // Step 5: Handle critical physical hazards safely
//             if (IsCriticalIssue(issue))
//                 return HandleCriticalIssue();

//             // Step 6: Guardrail for specific model error codes
//             // Small LLMs (1.5B) hallucinate hardware codes like "C-6", "C6000", "E-04".
//             if (IsSpecificErrorCode(issue))
//             {
//                 return "Vendor-specific error codes (such as Kyocera, Canon, or HP fault codes) require checking the service manual or entering technician maintenance mode. Please escalate this issue directly to IT Support.";
//             }

//             try
//             {
//                 var payload = new
//                 {
//                     model = ModelName,
//                     prompt = BuildPrompt(issue),
//                     stream = false,
//                     options = new { temperature = 0.1 } // Dropped temp to 0.1 to cut down hallucinations
//                 };

//                 for (int attempt = 0; attempt < 2; attempt++)
//                 {
//                     var response = await _httpClient.PostAsJsonAsync(OllamaEndpoint, payload);

//                     if (response.IsSuccessStatusCode)
//                     {
//                         var json = await response.Content.ReadAsStringAsync();

//                         var result = JsonSerializer.Deserialize<OllamaResponse>(
//                             json,
//                             new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
//                         );

//                         return result?.response?.Trim() ?? "No response from AI.";
//                     }

//                     _logger.LogWarning("Ollama request failed. Attempt {Attempt}", attempt + 1);
//                 }

//                 return "Unable to connect to the AI service.";
//             }
//             catch (TaskCanceledException)
//             {
//                 return "The AI request timed out. Please try again.";
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Ollama AI error");
//                 return "An unexpected AI error occurred.";
//             }
//         }

//         private string BuildPrompt(string issue)
//         {
//             // Using Qwen 2.5 native ChatML tags (<|im_start|> and <|im_end|>)
//             return $@"<|im_start|>system
// You are a concise, accurate ICT Helpdesk Assistant.

// Rules:
// 1. Provide 3-5 numbered troubleshooting steps.
// 2. If you do not know the exact cause of a specific hardware error code, state that IT Support must inspect the service manual. NEVER guess or invent causes (like ink or paper) for unknown hardware codes.
// 3. Keep instructions direct, factual, and actionable.<|im_end|>
// <|im_start|>user
// Printer paper jam<|im_end|>
// <|im_start|>assistant
// 1. Turn off the printer.
// 2. Open the paper access door or tray.
// 3. Gently pull out stuck paper in the direction of the paper path.
// 4. Close all covers and power the printer back on.<|im_end|>
// <|im_start|>user
// {issue}<|im_end|>
// <|im_start|>assistant
// ";
//         }

//         private bool IsIctIssue(string issue)
//         {
//             string[] ictKeywords =
//             {
//                 "printer", "computer", "desktop", "laptop", "internet",
//                 "wifi", "network", "monitor", "keyboard", "mouse",
//                 "login", "password", "screen", "pc", "router", "cable", "code", "error"
//             };

//             issue = issue.ToLower();
//             return ictKeywords.Any(k => issue.Contains(k));
//         }

//         // Regex check for hardware error patterns like "C-6", "C6000", "E04", "0x80070005"
//         private bool IsSpecificErrorCode(string issue)
//         {
//             var pattern = @"\b(code|error)?\s*([a-zA-Z]{1,2}[-–]?\d{1,4}|0x[0-9a-fA-F]+)\b";
//             return Regex.IsMatch(issue, pattern, RegexOptions.IgnoreCase);
//         }

//         private bool IsCriticalIssue(string issue)
//         {
//             string[] criticalKeywords =
//             {
//                 "fire", "electric shock", "explosion", "data loss",
//                 "hard drive failure", "server crash", "security breach",
//                 "virus", "malware", "ransomware", "network outage",
//                 "database", "power supply", "overheat", "smoke"
//             };

//             issue = issue.ToLower();
//             return criticalKeywords.Any(k => issue.Contains(k));
//         }

//         private string HandleCriticalIssue()
//         {
//             var safeSteps = new List<string>
//             {
//                 "Safely power down the equipment if safe to do so.",
//                 "Disconnect power cables if there is a risk of short circuit or thermal damage.",
//                 "Do not attempt physical repairs on internal electrical components."
//             };

//             var numberedSteps = string.Join(Environment.NewLine, safeSteps.Select((s, i) => $"{i + 1}. {s}"));
//             return $"{numberedSteps}\n\nCritical condition detected. Please contact the IT Infrastructure team immediately.";
//         }

//         private bool IsUnauthorizedAction(string issue)
//         {
//             string[] unsafeKeywords =
//             {
//                 "reformat", "reset", "install", "delete", "wipe", "restore factory settings", "format", "upgrade bios"
//             };

//             issue = issue.ToLower();
//             return unsafeKeywords.Any(k => issue.Contains(k));
//         }

//         private string HandleUnauthorizedAction()
//         {
//             return "This action requires administrative privileges. Please submit a request ticket to IT Support.";
//         }
//     }
// }
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace BACKEND.Services
{
    public class OllamaService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<OllamaService> _logger;
        
        private const string OllamaEndpoint = "api/chat"; 
        private const string ModelName = "qwen:latest";

        // Compatible across all .NET versions with Compiled optimization
        private static readonly Regex ErrorCodeRegex = new(
            @"\b(code|error)?\s*([a-zA-Z]{1,2}[-–]?\d{1,4}|0x[0-9a-fA-F]+)\b",
            RegexOptions.IgnoreCase | RegexOptions.Compiled
        );

        public OllamaService(HttpClient httpClient, ILogger<OllamaService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task<string> AnalyzeTicket(string issue, CancellationToken ct = default)
        {
            if (string.IsNullOrWhiteSpace(issue))
                return "Please describe the issue.";

            issue = issue.Trim();
            if (issue.Length > 500)
                issue = issue[..500];

            if (!IsIctIssue(issue))
                return "This assistant only supports basic ICT equipment troubleshooting.";

            if (IsUnauthorizedAction(issue))
                return "This action requires administrative privileges. Please submit a request ticket to IT Support.";

            if (IsCriticalIssue(issue))
                return HandleCriticalIssue();

            if (ErrorCodeRegex.IsMatch(issue))
            {
                return "Vendor-specific error codes (such as Kyocera, Canon, or HP fault codes) require checking the service manual or entering technician maintenance mode. Please escalate this issue directly to IT Support.";
            }

            var payload = new OllamaChatRequest
            {
                Model = ModelName,
                Stream = false,
                Options = new OllamaOptions { Temperature = 0.1f },
                Messages = new[]
                {
                    new OllamaMessage { Role = "system", Content = "You are a concise, accurate ICT Helpdesk Assistant. Provide 3-5 numbered troubleshooting steps. If you do not know the exact cause of a hardware code, escalate to IT. Never guess causes." },
                    new OllamaMessage { Role = "user", Content = "Printer paper jam" },
                    new OllamaMessage { Role = "assistant", Content = "1. Turn off the printer.\n2. Open the paper access door or tray.\n3. Gently pull out stuck paper in the direction of the paper path.\n4. Close all covers and power the printer back on." },
                    new OllamaMessage { Role = "user", Content = issue }
                }
            };

            for (int attempt = 1; attempt <= 2; attempt++)
            {
                try
                {
                    var response = await _httpClient.PostAsJsonAsync(OllamaEndpoint, payload, ct);

                    if (response.IsSuccessStatusCode)
                    {
                        // Fixed: cancellationToken (singular)
                        var result = await response.Content.ReadFromJsonAsync<OllamaChatResponse>(cancellationToken: ct);
                        return result?.Message?.Content?.Trim() ?? "No response from AI.";
                    }

                    _logger.LogWarning("Ollama request failed with status {StatusCode}. Attempt {Attempt}", response.StatusCode, attempt);
                }
                catch (OperationCanceledException) when (ct.IsCancellationRequested)
                {
                    return "The request was canceled.";
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Ollama service error on attempt {Attempt}", attempt);
                }

                if (attempt < 2) 
                    await Task.Delay(500, ct);
            }

            return "Unable to connect to the AI service.";
        }

        private static bool IsIctIssue(string issue) =>
            IctKeywords.Any(k => issue.Contains(k, StringComparison.OrdinalIgnoreCase));

        private static bool IsCriticalIssue(string issue) =>
            CriticalKeywords.Any(k => issue.Contains(k, StringComparison.OrdinalIgnoreCase));

        private static bool IsUnauthorizedAction(string issue) =>
            UnauthorizedKeywords.Any(k => issue.Contains(k, StringComparison.OrdinalIgnoreCase));

        private static string HandleCriticalIssue() =>
            "1. Safely power down the equipment if safe to do so.\n2. Disconnect power cables if there is a risk of short circuit or thermal damage.\n3. Do not attempt physical repairs on internal electrical components.\n\nCritical condition detected. Please contact the IT Infrastructure team immediately.";

        private static readonly HashSet<string> IctKeywords = new(StringComparer.OrdinalIgnoreCase)
        {
            "printer", "computer", "desktop", "laptop", "internet", "wifi", "network",
            "monitor", "keyboard", "mouse", "login", "password", "screen", "pc", "router", "cable"
        };

        private static readonly HashSet<string> CriticalKeywords = new(StringComparer.OrdinalIgnoreCase)
        {
            "fire", "electric shock", "explosion", "data loss", "hard drive failure",
            "server crash", "security breach", "virus", "malware", "ransomware", "network outage",
            "database", "power supply", "overheat", "smoke"
        };

        private static readonly HashSet<string> UnauthorizedKeywords = new(StringComparer.OrdinalIgnoreCase)
        {
            "reformat", "reset", "install", "delete", "wipe", "restore factory settings", "format", "upgrade bios"
        };
    }

    public record OllamaChatRequest
    {
        [JsonPropertyName("model")] public string Model { get; init; } = "";
        [JsonPropertyName("messages")] public OllamaMessage[] Messages { get; init; } = Array.Empty<OllamaMessage>();
        [JsonPropertyName("stream")] public bool Stream { get; init; }
        [JsonPropertyName("options")] public OllamaOptions Options { get; init; } = new();
    }

    public record OllamaMessage
    {
        [JsonPropertyName("role")] public string Role { get; init; } = "";
        [JsonPropertyName("content")] public string Content { get; init; } = "";
    }

    public record OllamaOptions
    {
        [JsonPropertyName("temperature")] public float Temperature { get; init; }
    }

    public record OllamaChatResponse
    {
        [JsonPropertyName("message")] public OllamaMessage? Message { get; init; }
    }
}