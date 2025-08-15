using Valu.Api.Services;
using Valu.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IValueScoreService, ValueScoreService>();
builder.Services.AddScoped<IRecommendationService, RecommendationService>();
builder.Services.AddLogging();

// Add Alpha Vantage services
builder.Services.AddHttpClient();
builder.Services.Configure<AlphaVantageOptions>(
    builder.Configuration.GetSection("AlphaVantage"));
builder.Services.AddSingleton<IAlphaVantageService, AlphaVantageService>();
// Redis Cache Service
builder.Services.AddSingleton<ICacheService, RedisCacheService>();
builder.Services.AddScoped<ICacheBuildingService, CacheBuildingService>();

// Add CORS for React Native client
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactNative", policy =>
    {
        policy.AllowAnyOrigin() // Allow all origins for development
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS
app.UseCors("AllowReactNative");

// Add request logging middleware
app.Use(async (context, next) =>
{
    var startTime = DateTime.UtcNow;
    var method = context.Request.Method;
    var path = context.Request.Path + context.Request.QueryString;

    await next();

    var duration = DateTime.UtcNow - startTime;
    var statusCode = context.Response.StatusCode;

    // Color-coded logging based on status code
    var color = statusCode switch
    {
        >= 200 and < 300 => ConsoleColor.Green,   // Success
        >= 300 and < 400 => ConsoleColor.Yellow,  // Redirect
        >= 400 and < 500 => ConsoleColor.Red,     // Client Error
        >= 500 => ConsoleColor.Magenta,           // Server Error
        _ => ConsoleColor.White
    };

    var originalColor = Console.ForegroundColor;
    Console.ForegroundColor = color;
    Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] {method} {path} - {statusCode} - {duration.TotalMilliseconds:F1}ms");
    Console.ForegroundColor = originalColor;
});

// Health check
app.MapGet("/health", () => Results.Ok(new { 
    Status = "Healthy", 
    Timestamp = DateTime.UtcNow,
    Version = "1.0.0"
}));

// Companies endpoints
app.MapGet("/api/companies", async (ICompanyService service) => 
    await service.GetAllAsync());

app.MapGet("/api/companies/{id:guid}", async (Guid id, ICompanyService service) =>
{
    var company = await service.GetByIdAsync(id);
    return company is null ? Results.NotFound() : Results.Ok(company);
});

app.MapGet("/api/companies/{id:guid}/details", async (Guid id, ICompanyService service) =>
{
    var details = await service.GetDetailsAsync(id);
    return details is null ? Results.NotFound() : Results.Ok(details);
});

app.MapGet("/api/companies/search", async (
    string query, 
    ICompanyService service,
    int page = 1, 
    int pageSize = 20) =>
{
    if (string.IsNullOrWhiteSpace(query))
        return Results.BadRequest("Query parameter is required");
        
    var results = await service.SearchAsync(query, page, pageSize);
    return Results.Ok(results);
});

// Value Score endpoints
app.MapPost("/api/value-score/calculate", async (CalculateValueScoreRequest request, IValueScoreService valueScoreService) =>
{
    var result = await valueScoreService.CalculateValueScoreAsync(request);
    return Results.Ok(result);
});

app.MapGet("/api/value-score/{companyId}", async (Guid companyId, IValueScoreService valueScoreService) =>
{
    var result = await valueScoreService.GetValueScoreAsync(companyId);
    return result != null ? Results.Ok(result) : Results.NotFound();
});

app.MapGet("/api/value-score/top", async (int count, IValueScoreService valueScoreService) =>
{
    if (count <= 0 || count > 100)
        return Results.BadRequest("Count must be between 1 and 100");
    
    var result = await valueScoreService.GetTopValueStocksAsync(count);
    return Results.Ok(result);
});

// Cache building endpoint
app.MapPost("/api/cache/build", async (ICacheBuildingService cacheBuildingService) =>
{
    try
    {
        await cacheBuildingService.BuildInitialCacheAsync();
        return Results.Ok(new { Message = "Cache building completed!", Timestamp = DateTime.UtcNow });
    }
    catch (Exception ex)
    {
        return Results.Problem(
            title: "Cache building failed",
            detail: ex.Message,
            statusCode: 500
        );
    }
});

// Test domain extraction endpoint
app.MapGet("/api/test/domain-extraction", () =>
{
    var testUrls = new[]
    {
        "https://www.apple.com",
        "http://www.microsoft.com",
        "https://google.com",
        "https://www.amazon.com/something?param=value",
        "tesla.com",
        "https://www.alphabet.com/path/to/page",
        ""
    };

    var results = new List<object>();
    
    foreach (var url in testUrls)
    {
        var domain = ExtractDomain(url);
        results.Add(new { 
            OriginalUrl = url, 
            ExtractedDomain = domain,
            LogoUrl = !string.IsNullOrEmpty(domain) ? $"https://cdn.brandfetch.io/{domain}/w/400/h/400?c=1iduleAyYy1ycpyef1P" : null
        });
    }
    
    return Results.Ok(results);
});

// Test Alpha Vantage raw response
app.MapGet("/api/test/alphavantage-raw/{symbol}", async (string symbol, IAlphaVantageService alphaVantageService) =>
{
    try
    {
        var overview = await alphaVantageService.GetCompanyOverviewAsync(symbol);
        if (overview == null)
        {
            return Results.NotFound($"No data found for symbol {symbol}");
        }
        
        return Results.Ok(new
        {
            Symbol = overview.Symbol,
            Name = overview.Name,
            OfficialSite = overview.OfficialSite,
            HasOfficialSite = !string.IsNullOrEmpty(overview.OfficialSite),
            AllProperties = overview.GetType().GetProperties().Select(p => new { 
                PropertyName = p.Name, 
                Value = p.GetValue(overview)?.ToString() ?? "null" 
            })
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error: {ex.Message}");
    }
});

string? ExtractDomain(string officialSite)
{
    try
    {
        if (string.IsNullOrWhiteSpace(officialSite))
            return null;

        // Remove protocol if present
        var url = officialSite.Trim();
        if (url.StartsWith("http://"))
            url = url.Substring(7);
        else if (url.StartsWith("https://"))
            url = url.Substring(8);

        // Remove www. if present
        if (url.StartsWith("www."))
            url = url.Substring(4);

        // Remove path and query parameters
        var domain = url.Split('/')[0].Split('?')[0];

        return domain;
    }
    catch (Exception ex)
    {
        return $"ERROR: {ex.Message}";
    }
}


app.Run();
