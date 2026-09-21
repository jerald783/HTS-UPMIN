// using System;
// using System.Net.Http;
// using System.Net.Http.Json; // <--- Ensure this is present
// using System.Text.Json.Serialization;
// using System.Threading.Tasks;

// namespace BACKEND.Services
// {
//    public class OllamaAnalyzerService
// {
//     private readonly HttpClient _httpClient;

//     public OllamaAnalyzerService(HttpClient httpClient)
//     {
//         _httpClient = httpClient;
//     }

//     public async Task<string> AnalyzeAllDiagnosticsAsync(List<string> diagnostics)
//     {
//         string combinedText = string.Join("\n---\n", diagnostics);

//         var payload = new
//         {
//             model = "qwen:latest",
//             prompt = $"Analyze all the following diagnostic results from our ticket system. Provide a global summary highlighting common root causes, recurring patterns, and overall recommended fixes:\n\n{combinedText}",
//             stream = false
//         };

//         // Relative URI (no leading slash) to respect HttpClient BaseAddress
//         var response = await _httpClient.PostAsJsonAsync("api/generate", payload);
//         response.EnsureSuccessStatusCode();

//         var result = await response.Content.ReadFromJsonAsync<OllamaResponse>();
//         return result?.Response ?? "No response generated.";
//     }
// }

// public class OllamaResponse
// {
//     [JsonPropertyName("response")]
//     public string Response { get; set; } = string.Empty;
// }}

// using System.Text.Json.Serialization;

// public class OllamaAnalyzerService
// {
//     private readonly HttpClient _httpClient;

//     public OllamaAnalyzerService(HttpClient httpClient)
//     {
//         _httpClient = httpClient;
//     }

//     public async Task<string> AnalyzeAllDiagnosticsAsync(List<string> diagnostics)
//     {
//         string combinedText = string.Join("\n---\n", diagnostics);

//         string prompt = $@"
// You are an expert IT Systems Diagnostic Analyst. Analyze the following {diagnostics.Count} support ticket diagnostic logs and generate a clean report formatted strictly in raw HTML.

// Formatting Rules:
// - Do NOT use markdown backticks (do NOT wrap response in ```html or ```).
// - Use standard HTML tags: <h3>, <h4>, <ul>, <li>, <strong>, <p>, <span class='highlight'>.

// Required HTML Layout Structure:
// <div class='analysis-report'>
//   <div class='report-section'>
//     <h3>📊 Executive Summary</h3>
//     <p>Provide a clear 2-3 sentence overview summarizing the findings across all tickets.</p>
//   </div>

//   <div class='report-section'>
//     <h3>🚨 Primary Root Causes</h3>
//     <ul>
//       <li><strong>[Root Cause Name]:</strong> Brief explanation of the technical failure point.</li>
//     </ul>
//   </div>

//   <div class='report-section'>
//     <h3>🔍 Observed Patterns & Systemic Trends</h3>
//     <p>Describe recurring failure trends, affected modules, or time-based patterns.</p>
//   </div>

//   <div class='report-section'>
//     <h3>🛠️ Recommended Action Items</h3>
//     <ul>
//       <li><strong>[Action Step]:</strong> Clear, actionable fix or mitigation step for engineers.</li>
//     </ul>
//   </div>
// </div>

// Diagnostic Data to Analyze:
// {combinedText}";

//         var payload = new
//         {
//             model = "qwen:latest",
//             prompt = prompt,
//             stream = false
//         };

//         var response = await _httpClient.PostAsJsonAsync("api/generate", payload);
//         response.EnsureSuccessStatusCode();

//         var result = await response.Content.ReadFromJsonAsync<OllamaResponse>();
//         string rawResponse = result?.Response ?? "<p>No response generated.</p>";

//         // Clean off any markdown wrappers if the model includes them
//         return rawResponse.Replace("```html", "").Replace("```", "").Trim();
//     }
// }

// public class OllamaResponse
// {
//     [JsonPropertyName("response")]
//     public string Response { get; set; } = string.Empty;
// }
using System.Text.Json.Serialization;

public class OllamaAnalyzerService
{
    private readonly HttpClient _httpClient;

    public OllamaAnalyzerService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<string> AnalyzeAllDiagnosticsAsync(List<string> diagnostics)
    {
        string combinedText = string.Join("\n---\n", diagnostics);

        string prompt = $@"
You are a Principal IT Infrastructure Director and Hardware Lifecycle Engineer. Analyze the following {diagnostics.Count} diagnostic logs and construct a deep, two-part strategic report strictly in raw HTML.

Rules:
- Do NOT use markdown code blocks or backticks (no ```html).
- Output standard HTML tags matching the class names specified below.

Required HTML Report Structure:

<div class='report-container'>
  <!-- SECTION 1: REPORT SUMMARY -->
  <div class='report-header-banner'>
    <h2>📋 Executive Diagnostic & Operations Report</h2>
    <p>Comprehensive evaluation based on {diagnostics.Count} ticket entries.</p>
  </div>

  <div class='report-section'>
    <h3>📊 Executive Summary & Health Metrics</h3>
    <p>Provide a high-level summary of system performance, primary bottleneck trends, and critical failure points.</p>
  </div>

  <div class='report-section'>
    <h3>🚨 Root Cause & Diagnostic Breakdown</h3>
    <table class='report-table'>
      <thead>
        <tr>
          <th>Category / Issue</th>
          <th>Observed Diagnostic Pattern</th>
          <th>Severity</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>[Issue Category]</strong></td>
          <td>[Technical summary of the failure mechanism]</td>
          <td><span class='status-badge badge-high'>CRITICAL / HIGH</span></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- SECTION 2: DEEP ANALYSIS & ADVICE -->
  <div class='report-header-banner advisory-banner'>
    <h2>💡 Deep Strategic Advisory & Lifecycle Directives</h2>
  </div>

  <div class='report-section'>
    <h3>⚖️ Repair vs. Replacement Decision Matrix</h3>
    <p>Detailed cost-benefit evaluation of hardware and components mentioned in the diagnostics:</p>
    <ul>
      <li>
        <span class='status-badge badge-repair'>REPAIR RECOMMENDED</span> 
        <strong>[Hardware/Component]:</strong> [Justification: Low repair cost, software fix, or routine replacement part].
      </li>
      <li>
        <span class='status-badge badge-replace'>REPLACE / RETIRE</span> 
        <strong>[Hardware/Component]:</strong> [Justification: Severe degradation, recurring labor cost, or unviable ROI].
      </li>
    </ul>
  </div>

  <div class='report-section'>
    <h3>🏷️ Brand & Model Procurement Guidance</h3>
    <p>Vendor fault analysis, failure frequency tracking, and brand risk assessment:</p>
    <ul>
      <li>
        <span class='status-badge badge-warning'>VENDOR ALERT / PROCUREMENT BAN</span> 
        <strong>[Brand & Model]:</strong> [Reasoning: High repeat failure rate, design defect, or poor warranty support. Recommend blacklisting from future purchasing].
      </li>
      <li>
        <span class='status-badge badge-success'>APPROVED ALTERNATIVE</span> 
        <strong>[Recommended Brand / Specs]:</strong> [Suggested replacement models or specifications with better reliability records].
      </li>
    </ul>
  </div>

  <div class='report-section'>
    <h3>🛠️ Actionable Recommendations & Next Steps</h3>
    <div class='action-grid'>
      <div class='action-card'>
        <h4>Immediate Technical Actions</h4>
        <p>[Urgent fixes, firmware updates, or isolations to implement now]</p>
      </div>
      <div class='action-card'>
        <h4>Long-Term Policy & Purchasing Adjustments</h4>
        <p>[Process improvements, SLA adjustments, or hardware standards to revise]</p>
      </div>
    </div>
  </div>
</div>

Diagnostic Logs:
{combinedText}";

        var payload = new
        {
            model = "qwen:latest",
            prompt = prompt,
            stream = false
        };

        var response = await _httpClient.PostAsJsonAsync("api/generate", payload);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<OllamaResponse>();
        string rawResponse = result?.Response ?? "<p>No response generated.</p>";

        return rawResponse.Replace("```html", "").Replace("```", "").Trim();
    }
}

public class OllamaResponse
{
    [JsonPropertyName("response")]
    public string Response { get; set; } = string.Empty;
}