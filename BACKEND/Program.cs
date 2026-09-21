using System.Text;
using System.Threading.RateLimiting;
using BACKEND.Filters;
using BACKEND.Hubs;
using BACKEND.Services;
using Backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
// Services & Controllers
// =============================
builder.Services.AddDataProtection();
builder.Services.AddScoped<IActivityLogService, ActivityLogService>();
builder.Services.AddScoped<ActivityLogFilter>();

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ActivityLogFilter>();
});

// =============================
// External Services (HttpClient / SMTP)
// =============================
builder.Services.AddHttpClient<OllamaService>(client =>
{
    // Configure base address via appsettings or environment variable
    var ollamaUri = builder.Configuration["Ollama:BaseAddress"] ?? "http://localhost:11434/";
    client.BaseAddress = new Uri(ollamaUri);
    client.Timeout = TimeSpan.FromMinutes(5);
});

builder.Services.AddScoped<SmtpService>();
builder.Services.AddHttpClient<OllamaAnalyzerService>(client =>
{
    var ollamaUri = builder.Configuration["Ollama:BaseAddress"] ?? "http://localhost:11434/";
    client.BaseAddress = new Uri(ollamaUri);
    client.Timeout = TimeSpan.FromMinutes(5);
});

// =============================
// Rate Limiting Configuration
// =============================
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddFixedWindowLimiter("strict-api", opt =>
    {
        opt.PermitLimit = 60;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 5;
    });
});

// =============================
// Allowed Origins Array
// =============================
// Read the array directly from appsettings.json
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() 
    ?? Array.Empty<string>();
// var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() 
//     ?? new[]
//     {
//         "https://hts-upmin.vercel.app",
//         "http://localhost:4200"
//     };

// =============================
// CORS Configuration
// =============================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// =============================
// JSON Configuration
// =============================
builder.Services.AddControllersWithViews()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        options.SerializerSettings.ContractResolver = new DefaultContractResolver();
    });

// =============================
// SignalR
// =============================
builder.Services.AddSignalR();

// =============================
// JWT Authentication
// =============================
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

if (string.IsNullOrWhiteSpace(secretKey))
{
    throw new InvalidOperationException("JWT SecretKey is missing in environment or appsettings configuration.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ClockSkew = TimeSpan.Zero // Strict expiration handling
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var path = context.HttpContext.Request.Path;
                var accessToken = context.Request.Query["access_token"];

                // Retrieve JWT for SignalR Hubs
                if (!string.IsNullOrEmpty(accessToken) &&
                    (path.StartsWithSegments("/hubs/notification") || path.StartsWithSegments("/chathub")))
                {
                    context.Token = accessToken;
                }

                // Fallback to cookie authentication if bearer header is missing
                if (string.IsNullOrEmpty(context.Token))
                {
                    context.Token = context.Request.Cookies["authToken"];
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

// =============================
// Exception Handling
// =============================
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// =============================
// Security Headers Middleware
// =============================
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Append("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

    context.Response.Headers.Append("Cross-Origin-Resource-Policy", "cross-origin");
    context.Response.Headers.Append("Cross-Origin-Embedder-Policy", "unsafe-none");
    context.Response.Headers.Append("Cross-Origin-Opener-Policy", "same-origin");

    context.Response.Headers.Append("Content-Security-Policy",
        "default-src 'self'; " +
        "connect-src 'self' https://hts-upmin.vercel.app http://localhost:5000 https://localhost:5001 ws://localhost:5000 wss://localhost:5001 wss://*.devtunnels.ms ws://*.devtunnels.ms; " +
        "script-src 'self' 'unsafe-inline' https://code.jquery.com https://cdn.jsdelivr.net; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;");

    await next();
});

// =============================
// Core Middleware Routing Pipeline
// =============================
app.UseHttpsRedirection();
app.UseRouting();

// CORS must be executed BEFORE Custom Security Middleware to handle preflights correctly
app.UseCors("AllowOrigin");

// =============================
// Strict Origin & Referer Enforcement
// =============================

app.Use(async (context, next) =>
{
    // 1. Bypass check for HTTP OPTIONS preflight requests
    if (HttpMethods.IsOptions(context.Request.Method))
    {
        await next();
        return;
    }

    var path = context.Request.Path.Value ?? "";

    if (path.StartsWith("/api", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/hubs", StringComparison.OrdinalIgnoreCase) ||
        path.StartsWith("/chathub", StringComparison.OrdinalIgnoreCase))
    {
        var origin = context.Request.Headers["Origin"].ToString();
        var referer = context.Request.Headers["Referer"].ToString();

        bool isValidOrigin = !string.IsNullOrEmpty(origin) &&
                             allowedOrigins.Any(o => origin.Equals(o, StringComparison.OrdinalIgnoreCase));

        bool isValidReferer = !string.IsNullOrEmpty(referer) &&
                              allowedOrigins.Any(o => referer.StartsWith(o, StringComparison.OrdinalIgnoreCase));

        if (!isValidOrigin && !isValidReferer)
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync("{\"error\": \"Forbidden. Unauthorized origin or direct access denied.\"}");
            return;
        }
    }

    await next();
});

// //If local
// app.Use(async (context, next) =>
// {
//     var path = context.Request.Path.Value ?? "";

//     // 🔥 Bypass strict check ONLY when running locally in Development mode
//     if (!app.Environment.IsDevelopment())
//     {
//         if (path.StartsWith("/api", StringComparison.OrdinalIgnoreCase) || 
//             path.StartsWith("/hubs", StringComparison.OrdinalIgnoreCase) ||
//             path.StartsWith("/chathub", StringComparison.OrdinalIgnoreCase))
//         {
//             var origin = context.Request.Headers["Origin"].ToString();
//             var referer = context.Request.Headers["Referer"].ToString();

//             bool isValidOrigin = !string.IsNullOrEmpty(origin) && 
//                                  allowedOrigins.Any(o => origin.Equals(o, StringComparison.OrdinalIgnoreCase));

//             bool isValidReferer = !string.IsNullOrEmpty(referer) && 
//                                   allowedOrigins.Any(o => referer.StartsWith(o, StringComparison.OrdinalIgnoreCase));

//             if (!isValidOrigin && !isValidReferer)
//             {
//                 context.Response.StatusCode = StatusCodes.Status403Forbidden;
//                 context.Response.ContentType = "application/json";
//                 await context.Response.WriteAsync("{\"error\": \"Forbidden. Unauthorized origin or direct address bar access.\"}");
//                 return;
//             }
//         }
//     }

//     await next();
// });

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

// =============================
// Static File Serving
// =============================
app.UseStaticFiles(); // Default wwwroot serving

void RegisterStaticFolder(string relativeFolder, string requestPath)
{
    var absolutePath = Path.Combine(app.Environment.ContentRootPath, relativeFolder);
    Directory.CreateDirectory(absolutePath);

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(absolutePath),
        RequestPath = requestPath
    });
}

RegisterStaticFolder(Path.Combine("Assets", "webinar-uploads"), "/webinar-uploads");
RegisterStaticFolder("Assets", "/Assets");
RegisterStaticFolder(Path.Combine("Assets", "ChatFiles"), "/ChatFiles");

// =============================
// Endpoints & Hubs
// =============================
app.MapControllers().RequireRateLimiting("strict-api");

app.MapHub<NotificationHub>("/hubs/notification");
app.MapHub<ChatHub>("/chathub");

app.Run();















// using Microsoft.Extensions.FileProviders;
// using Newtonsoft.Json.Serialization;
// using BACKEND.Hubs;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.IdentityModel.Tokens;
// using System.Text;
// using Backend.Models;
// using BACKEND.Services;
// using BACKEND.Filters;
// using Microsoft.AspNetCore.RateLimiting;
// using System.Threading.RateLimiting;

// var builder = WebApplication.CreateBuilder(args);

// // =============================
// // Activity Log Service
// // =============================
// builder.Services.AddScoped<IActivityLogService, ActivityLogService>();
// builder.Services.AddScoped<ActivityLogFilter>();

// builder.Services.AddControllers(options =>
// {
//     options.Filters.Add<ActivityLogFilter>();
// });

// // =============================
// // Ollama AI Service
// // =============================
// builder.Services.AddHttpClient<OllamaService>(client =>
// {
//     client.BaseAddress = new Uri("http://localhost:11434/");
//     client.Timeout = TimeSpan.FromMinutes(5);
// });

// // =============================
// // SMTP Email Service
// // =============================
// builder.Services.AddScoped<SmtpService>();

// var jwtSettings = builder.Configuration.GetSection("JwtSettings");

// // =============================
// // Rate Limiting Configuration
// // =============================
// // 🔥 Protects DevTunnel endpoints from brute-force & automated scanning
// builder.Services.AddRateLimiter(options =>
// {
//     options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    
//     options.AddFixedWindowLimiter("strict-api", opt =>
//     {
//         opt.PermitLimit = 60; // Allow 60 requests
//         opt.Window = TimeSpan.FromMinutes(1); // Per minute
//         opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
//         opt.QueueLimit = 5;
//     });
// });

// // =============================
// // Allowed Origins Array
// // =============================
// var allowedOrigins = new[]
// {
//     "https://hts-upmin.vercel.app",// Standard frontend dev server (Vercel)
//     "http://localhost:4200" // Standard frontend dev server (Angular)
// };

// // =============================
// // CORS Configuration
// // =============================
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowOrigin", policy =>
//     {
//         policy.WithOrigins(allowedOrigins)
//               .AllowAnyMethod()
//               .AllowAnyHeader()
//               .AllowCredentials();
//     });
// });

// // =============================
// // JSON Configuration
// // =============================
// builder.Services.AddControllersWithViews()
//     .AddNewtonsoftJson(options =>
//     {
//         options.SerializerSettings.ReferenceLoopHandling =
//             Newtonsoft.Json.ReferenceLoopHandling.Ignore;

//         options.SerializerSettings.ContractResolver =
//             new DefaultContractResolver();
//     });

// // =============================
// // SignalR
// // =============================
// builder.Services.AddSignalR();

// // =============================
// // JWT Authentication
// // =============================
// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(options =>
//     {
//         options.TokenValidationParameters = new TokenValidationParameters
//         {
//             ValidateIssuer = true,
//             ValidateAudience = true,
//             ValidateLifetime = true,
//             ValidateIssuerSigningKey = true,

//             ValidIssuer = jwtSettings["Issuer"],
//             ValidAudience = jwtSettings["Audience"],

//             IssuerSigningKey = new SymmetricSecurityKey(
//                 Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!))
//         };

//         options.Events = new JwtBearerEvents
//         {
//             OnMessageReceived = context =>
//             {
//                 // SignalR Token
//                 var accessToken = context.Request.Query["access_token"];
//                 var path = context.HttpContext.Request.Path;

//                 if (!string.IsNullOrEmpty(accessToken) &&
//                     (path.StartsWithSegments("/hubs/notification") || path.StartsWithSegments("/chathub")))
//                 {
//                     context.Token = accessToken;
//                 }

//                 // Cookie Token
//                 if (string.IsNullOrEmpty(context.Token))
//                 {
//                     context.Token = context.Request.Cookies["authToken"];
//                 }

//                 return Task.CompletedTask;
//             }
//         };
//     });

// builder.Services.AddAuthorization();

// var app = builder.Build();

// // =============================
// // Development Exception Page
// // =============================
// if (app.Environment.IsDevelopment())
// {
//     app.UseDeveloperExceptionPage();
// }

// // =============================
// // Strict Origin & Referer Enforcement
// // =============================
// //Online
// app.Use(async (context, next) =>
// {
//     var path = context.Request.Path.Value ?? "";

//     // Apply validation to API routes and WebSockets
//     if (path.StartsWith("/api", StringComparison.OrdinalIgnoreCase) || 
//         path.StartsWith("/hubs", StringComparison.OrdinalIgnoreCase) ||
//         path.StartsWith("/chathub", StringComparison.OrdinalIgnoreCase))
//     {
//         var origin = context.Request.Headers["Origin"].ToString();
//         var referer = context.Request.Headers["Referer"].ToString();

//         // Check if incoming origin/referer matches any allowed host
//         bool isValidOrigin = !string.IsNullOrEmpty(origin) && 
//                              allowedOrigins.Any(o => origin.Equals(o, StringComparison.OrdinalIgnoreCase));

//         bool isValidReferer = !string.IsNullOrEmpty(referer) && 
//                               allowedOrigins.Any(o => referer.StartsWith(o, StringComparison.OrdinalIgnoreCase));

//         // Block direct browser address bar hits or requests from unknown domains
//         if (!isValidOrigin && !isValidReferer)
//         {
//             context.Response.StatusCode = StatusCodes.Status403Forbidden;
//             context.Response.ContentType = "application/json";
//             await context.Response.WriteAsync("{\"error\": \"Forbidden. Unauthorized origin or direct address bar access.\"}");
//             return;
//         }
//     }

//     await next();
// });

// //If local
// // app.Use(async (context, next) =>
// // {
// //     var path = context.Request.Path.Value ?? "";

// //     // 🔥 Bypass strict check ONLY when running locally in Development mode
// //     if (!app.Environment.IsDevelopment())
// //     {
// //         if (path.StartsWith("/api", StringComparison.OrdinalIgnoreCase) || 
// //             path.StartsWith("/hubs", StringComparison.OrdinalIgnoreCase) ||
// //             path.StartsWith("/chathub", StringComparison.OrdinalIgnoreCase))
// //         {
// //             var origin = context.Request.Headers["Origin"].ToString();
// //             var referer = context.Request.Headers["Referer"].ToString();

// //             bool isValidOrigin = !string.IsNullOrEmpty(origin) && 
// //                                  allowedOrigins.Any(o => origin.Equals(o, StringComparison.OrdinalIgnoreCase));

// //             bool isValidReferer = !string.IsNullOrEmpty(referer) && 
// //                                   allowedOrigins.Any(o => referer.StartsWith(o, StringComparison.OrdinalIgnoreCase));

// //             if (!isValidOrigin && !isValidReferer)
// //             {
// //                 context.Response.StatusCode = StatusCodes.Status403Forbidden;
// //                 context.Response.ContentType = "application/json";
// //                 await context.Response.WriteAsync("{\"error\": \"Forbidden. Unauthorized origin or direct address bar access.\"}");
// //                 return;
// //             }
// //         }
// //     }

// //     await next();
// // });


// // =============================
// // Security Headers & CSP
// // =============================
// app.Use(async (context, next) =>
// {
//     context.Response.Headers.Append("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
//     context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
//     context.Response.Headers.Append("X-Frame-Options", "DENY");
//     context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
//     context.Response.Headers.Append("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    
//     context.Response.Headers.Append("Cross-Origin-Resource-Policy", "cross-origin");
//     context.Response.Headers.Append("Cross-Origin-Embedder-Policy", "unsafe-none");
//     context.Response.Headers.Append("Cross-Origin-Opener-Policy", "same-origin");
    
//     // Content-Security-Policy
//     context.Response.Headers.Append("Content-Security-Policy",
//         "default-src 'self'; " +
//         "connect-src 'self' https://hts-upmin.vercel.app http://localhost:5000 https://localhost:5001 ws://localhost:5000 wss://localhost:5001 wss://*.devtunnels.ms ws://*.devtunnels.ms; " +
//         "script-src 'self' 'unsafe-inline' https://code.jquery.com https://cdn.jsdelivr.net; " +
//         "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
//         "font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;");
    
//     await next();
// });

// // =============================
// // Middleware Pipeline
// // =============================
// app.UseHttpsRedirection();
// app.UseStaticFiles();

// app.UseRouting();

// app.UseCors("AllowOrigin");

// // 🔥 Apply Rate Limiting to HTTP request pipeline
// app.UseRateLimiter();

// app.UseAuthentication();
// app.UseAuthorization();

// // =============================
// // Static File Serving
// // =============================

// // 1. Webinar Uploads Folder
// var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "webinar-uploads");
// Directory.CreateDirectory(uploadsPath);

// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(uploadsPath),
//     RequestPath = "/webinar-uploads"
// });

// // 2. Root Assets Folder
// var assetsRootPath = Path.Combine(Directory.GetCurrentDirectory(), "Assets");
// Directory.CreateDirectory(assetsRootPath);

// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(assetsRootPath),
//     RequestPath = "/Assets"
// });

// // 3. Chat Files Folder
// var chatFilesPath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "ChatFiles");
// Directory.CreateDirectory(chatFilesPath);

// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(chatFilesPath),
//     RequestPath = "/ChatFiles"
// });

// // =============================
// // Endpoints
// // =============================
// // Apply the rate limiter globally to all mapped controllers
// app.MapControllers().RequireRateLimiting("strict-api");

// // SIGNALR
// app.MapHub<NotificationHub>("/hubs/notification");
// app.MapHub<ChatHub>("/chathub");

// // =============================
// // Run
// // =============================
// app.Run();








// using Microsoft.Extensions.FileProviders;
// using Newtonsoft.Json.Serialization;
// using BACKEND.Hubs;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.IdentityModel.Tokens;
// using System.Text;
// using Backend.Models;
// using BACKEND.Services;
// using BACKEND.Filters;

// var builder = WebApplication.CreateBuilder(args);

// // =============================
// // Activity Log Service
// // =============================
// builder.Services.AddScoped<IActivityLogService, ActivityLogService>();
// builder.Services.AddScoped<ActivityLogFilter>();

// builder.Services.AddControllers(options =>
// {
//     options.Filters.Add<ActivityLogFilter>();
// });

// // =============================
// // Ollama AI Service
// // =============================
// builder.Services.AddHttpClient<OllamaService>(client =>
// {
//     client.BaseAddress = new Uri("http://localhost:11434/");
//     client.Timeout = TimeSpan.FromMinutes(5);
// });

// // =============================
// // SMTP Email Service
// // =============================
// builder.Services.AddScoped<SmtpService>();

// var jwtSettings = builder.Configuration.GetSection("JwtSettings");

// // =============================
// // Allowed Origins Array
// // =============================
// var allowedOrigins = new[]
// {
//     "https://hts-upmin.vercel.app",
//     "http://localhost:4200" // Standard frontend dev server (e.g., Angular)
// };

// // =============================
// // CORS Configuration
// // =============================
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowOrigin", policy =>
//     {
//         policy.WithOrigins(allowedOrigins)
//               .AllowAnyMethod()
//               .AllowAnyHeader()
//               .AllowCredentials();
//     });
// });

// // =============================
// // JSON Configuration
// // =============================
// builder.Services.AddControllersWithViews()
//     .AddNewtonsoftJson(options =>
//     {
//         options.SerializerSettings.ReferenceLoopHandling =
//             Newtonsoft.Json.ReferenceLoopHandling.Ignore;

//         options.SerializerSettings.ContractResolver =
//             new DefaultContractResolver();
//     });

// // =============================
// // SignalR
// // =============================
// builder.Services.AddSignalR();

// // =============================
// // JWT Authentication
// // =============================
// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(options =>
//     {
//         options.TokenValidationParameters = new TokenValidationParameters
//         {
//             ValidateIssuer = true,
//             ValidateAudience = true,
//             ValidateLifetime = true,
//             ValidateIssuerSigningKey = true,

//             ValidIssuer = jwtSettings["Issuer"],
//             ValidAudience = jwtSettings["Audience"],

//             IssuerSigningKey = new SymmetricSecurityKey(
//                 Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!))
//         };

//         options.Events = new JwtBearerEvents
//         {
//             OnMessageReceived = context =>
//             {
//                 // SignalR Token
//                 var accessToken = context.Request.Query["access_token"];
//                 var path = context.HttpContext.Request.Path;

//                 if (!string.IsNullOrEmpty(accessToken) &&
//                     (path.StartsWithSegments("/hubs/notification") || path.StartsWithSegments("/chathub")))
//                 {
//                     context.Token = accessToken;
//                 }

//                 // Cookie Token
//                 if (string.IsNullOrEmpty(context.Token))
//                 {
//                     context.Token = context.Request.Cookies["authToken"];
//                 }

//                 return Task.CompletedTask;
//             }
//         };
//     });

// builder.Services.AddAuthorization();

// var app = builder.Build();

// // =============================
// // Development Exception Page
// // =============================
// if (app.Environment.IsDevelopment())
// {
//     app.UseDeveloperExceptionPage();
// }

// // =============================
// // Strict Origin & Referer Enforcement
// // =============================
// app.Use(async (context, next) =>
// {
//     var path = context.Request.Path.Value ?? "";

//     // Apply validation to API routes and WebSockets
//     if (path.StartsWith("/api", StringComparison.OrdinalIgnoreCase) || 
//         path.StartsWith("/hubs", StringComparison.OrdinalIgnoreCase) ||
//         path.StartsWith("/chathub", StringComparison.OrdinalIgnoreCase))
//     {
//         var origin = context.Request.Headers["Origin"].ToString();
//         var referer = context.Request.Headers["Referer"].ToString();

//         // Check if incoming origin/referer matches any allowed host
//         bool isValidOrigin = !string.IsNullOrEmpty(origin) && 
//                              allowedOrigins.Any(o => origin.Equals(o, StringComparison.OrdinalIgnoreCase));

//         bool isValidReferer = !string.IsNullOrEmpty(referer) && 
//                               allowedOrigins.Any(o => referer.StartsWith(o, StringComparison.OrdinalIgnoreCase));

//         // Block direct browser address bar hits or requests from unknown domains
//         if (!isValidOrigin && !isValidReferer)
//         {
//             context.Response.StatusCode = StatusCodes.Status403Forbidden;
//             context.Response.ContentType = "application/json";
//             await context.Response.WriteAsync("{\"error\": \"Forbidden. Unauthorized origin or direct address bar access.\"}");
//             return;
//         }
//     }

//     await next();
// });

// // =============================
// // Security Headers & CSP
// // =============================
// app.Use(async (context, next) =>
// {
//     context.Response.Headers.Append("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
//     context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
//     context.Response.Headers.Append("X-Frame-Options", "DENY");
//     context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
//     context.Response.Headers.Append("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    
//     context.Response.Headers.Append("Cross-Origin-Resource-Policy", "cross-origin");
//     context.Response.Headers.Append("Cross-Origin-Embedder-Policy", "unsafe-none");
//     context.Response.Headers.Append("Cross-Origin-Opener-Policy", "same-origin");
    
//     // Updated CSP to allow connect-src for both Vercel and localhost
//     context.Response.Headers.Append("Content-Security-Policy",
//         "default-src 'self'; " +
//         "connect-src 'self' https://hts-upmin.vercel.app http://localhost:5000 https://localhost:5001 ws://localhost:5000 wss://localhost:5001 wss://*.devtunnels.ms ws://*.devtunnels.ms; " +
//         "script-src 'self' 'unsafe-inline' https://code.jquery.com https://cdn.jsdelivr.net; " +
//         "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
//         "font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;");
    
//     await next();
// });

// // =============================
// // Middleware Pipeline
// // =============================
// app.UseHttpsRedirection();
// app.UseStaticFiles();

// app.UseRouting();

// app.UseCors("AllowOrigin");

// app.UseAuthentication();
// app.UseAuthorization();

// // =============================
// // Static File Serving
// // =============================

// // 1. Webinar Uploads Folder
// var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "webinar-uploads");
// Directory.CreateDirectory(uploadsPath);

// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(uploadsPath),
//     RequestPath = "/webinar-uploads"
// });

// // 2. Root Assets Folder
// var assetsRootPath = Path.Combine(Directory.GetCurrentDirectory(), "Assets");
// Directory.CreateDirectory(assetsRootPath);

// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(assetsRootPath),
//     RequestPath = "/Assets"
// });

// // 3. Chat Files Folder
// var chatFilesPath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "ChatFiles");
// Directory.CreateDirectory(chatFilesPath);

// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(chatFilesPath),
//     RequestPath = "/ChatFiles"
// });

// // =============================
// // Endpoints
// // =============================
// app.MapControllers();

// // SIGNALR
// app.MapHub<NotificationHub>("/hubs/notification");
// app.MapHub<ChatHub>("/chathub");

// // =============================
// // Run
// // =============================
// app.Run();













// using Microsoft.Extensions.FileProviders;
// using Newtonsoft.Json.Serialization;
// using BACKEND.Hubs;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.IdentityModel.Tokens;
// using System.Text;
// using Backend.Models;
// using BACKEND.Services;
// using BACKEND.Filters;

// var builder = WebApplication.CreateBuilder(args);
// // =============================
// // Activity Log Service
// // =============================
// builder.Services.AddScoped<IActivityLogService, ActivityLogService>();
// builder.Services.AddScoped<ActivityLogFilter>();

// builder.Services.AddControllers(options =>
// {
//     options.Filters.Add<ActivityLogFilter>();
// });

// // =============================
// // Ollama AI Service
// // =============================
// builder.Services.AddHttpClient<OllamaService>(client =>
// {
//     client.BaseAddress = new Uri("http://localhost:11434/");
//     client.Timeout = TimeSpan.FromMinutes(5);
// });

// // =============================
// // SMTP Email Service
// // =============================
// builder.Services.AddScoped<SmtpService>();

// // 📝 NOTE: appsettings.json is loaded automatically by CreateBuilder. Manual initialization removed to prevent path parsing exceptions.
// var jwtSettings = builder.Configuration.GetSection("JwtSettings");

// // 📝 NOTE: SmtpSettings configuration binding removed because settings are handled dynamically via your MySQL database.

// // =============================
// // CORS Configuration
// // =============================
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowOrigin", policy =>
//     {
//         policy.WithOrigins("http://localhost:4200")
//               .AllowAnyMethod()
//               .AllowAnyHeader()
//               .AllowCredentials();
//     });
// });

// // =============================
// // JSON Configuration
// // =============================
// builder.Services.AddControllersWithViews()
//     .AddNewtonsoftJson(options =>
//     {
//         options.SerializerSettings.ReferenceLoopHandling =
//             Newtonsoft.Json.ReferenceLoopHandling.Ignore;

//         options.SerializerSettings.ContractResolver =
//             new DefaultContractResolver();
//     });

// // =============================
// // SignalR
// // =============================
// builder.Services.AddSignalR();

// // =============================
// // JWT Authentication
// // =============================
// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(options =>
//     {
//         options.TokenValidationParameters = new TokenValidationParameters
//         {
//             ValidateIssuer = true,
//             ValidateAudience = true,
//             ValidateLifetime = true,
//             ValidateIssuerSigningKey = true,

//             ValidIssuer = jwtSettings["Issuer"],
//             ValidAudience = jwtSettings["Audience"],

//             IssuerSigningKey = new SymmetricSecurityKey(
//                 Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!))
//         };

//         options.Events = new JwtBearerEvents
//         {
//             OnMessageReceived = context =>
//             {
//                 // =========================
//                 // SIGNALR TOKEN
//                 // =========================
//                 var accessToken = context.Request.Query["access_token"];
//                 var path = context.HttpContext.Request.Path;

//                 if (!string.IsNullOrEmpty(accessToken) &&
//                     path.StartsWithSegments("/hubs/notification"))
//                 {
//                     context.Token = accessToken;
//                 }

//                 // =========================
//                 // COOKIE TOKEN
//                 // =========================
//                 if (string.IsNullOrEmpty(context.Token))
//                 {
//                     context.Token = context.Request.Cookies["authToken"];
//                 }

//                 return Task.CompletedTask;
//             }
//         };
//     });

// builder.Services.AddAuthorization();

// var app = builder.Build();

// // =============================
// // Development
// // =============================
// if (app.Environment.IsDevelopment())
// {
//     app.UseDeveloperExceptionPage();
// }

// // // =============================
// // // Security Headers
// // // =============================
// // app.Use(async (context, next) =>
// // {
// //     context.Response.Headers.Append("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
// //     context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
// //     context.Response.Headers.Append("X-Frame-Options", "DENY");
// //     context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
// //     context.Response.Headers.Append("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
// //     context.Response.Headers.Append("Cross-Origin-Resource-Policy", "same-origin");
// //     context.Response.Headers.Append("Cross-Origin-Embedder-Policy", "require-corp");
// //     context.Response.Headers.Append("Cross-Origin-Opener-Policy", "same-origin");
// //     context.Response.Headers.Append("Content-Security-Policy",
// //         "default-src 'self'; script-src 'self' https://code.jquery.com https://cdn.jsdelivr.net; " +
// //         "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
// //         "font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;");
    
// //     await next();
// // });
// // =============================
// // Security Headers
// // =============================
// app.Use(async (context, next) =>
// {
//     context.Response.Headers.Append("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
//     context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
//     context.Response.Headers.Append("X-Frame-Options", "DENY");
//     context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
//     context.Response.Headers.Append("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    
//     // 🔥 FIX: Changed to allow your cross-origin Angular app to read responses
//     context.Response.Headers.Append("Cross-Origin-Resource-Policy", "cross-origin");
//     context.Response.Headers.Append("Cross-Origin-Embedder-Policy", "unsafe-none");
//     context.Response.Headers.Append("Cross-Origin-Opener-Policy", "same-origin");
    
//     // 🔥 FIX: Added 'connect-src' so your frontend doesn't get blocked when calling your local APIs & WebSockets
//     context.Response.Headers.Append("Content-Security-Policy",
//         "default-src 'self'; " +
//         "connect-src 'self' http://192.168.1.6:5000 https://192.168.1.6:5001 http://localhost:11434 http://localhost:5000 https://localhost:5001 ws://192.168.1.6:5000 ws://localhost:5000; " +
//         "script-src 'self' 'unsafe-inline' https://code.jquery.com https://cdn.jsdelivr.net; " +
//         "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
//         "font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;");
    
//     await next();
// });

// // =============================
// // Middleware Pipeline
// // =============================
// app.UseHttpsRedirection();
// app.UseStaticFiles();

// app.UseRouting();

// app.UseCors("AllowOrigin");

// // ✅ MUST be in this order
// app.UseAuthentication();
// app.UseAuthorization();

// // =============================
// // Static File Serving (Crash Proofed)
// // =============================

// // 1. Webinar Uploads Folder
// var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "webinar-uploads");
// Directory.CreateDirectory(uploadsPath);

// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(uploadsPath),
//     RequestPath = "/webinar-uploads"
// });

// // 2. Root Assets Folder
// var assetsRootPath = Path.Combine(Directory.GetCurrentDirectory(), "Assets");
// Directory.CreateDirectory(assetsRootPath);

// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(assetsRootPath),
//     RequestPath = "/Assets"
// });

// // 3. Chat Files Folder
// var chatFilesPath = Path.Combine(Directory.GetCurrentDirectory(), "Assets", "ChatFiles");
// Directory.CreateDirectory(chatFilesPath); // ✅ Safely ensures directory exists before PhysicalFileProvider mounts it

// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(chatFilesPath),
//     RequestPath = "/ChatFiles"
// });

// // =============================
// // Endpoints
// // =============================
// app.MapControllers();

// // ✅ SIGNALR
// app.MapHub<NotificationHub>("/hubs/notification");
// app.MapHub<ChatHub>("/chathub");

// // =============================
// // Run
// // =============================
// app.Run();

