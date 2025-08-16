using Valu.Api.Services;
using Valu.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IScoringService, ScoringService>();
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
app.MapPost("/api/value-score/calculate", async (CalculateValueScoreRequest request, IScoringService scoringService) =>
{
    var result = await scoringService.CalculateValueScoreAsync(request);
    return Results.Ok(result);
});

app.MapGet("/api/value-score/{companyId}", async (Guid companyId, IScoringService scoringService) =>
{
    var result = await scoringService.GetValueScoreAsync(companyId);
    return result != null ? Results.Ok(result) : Results.NotFound();
});

app.MapGet("/api/value-score/top", async (int count, IScoringService scoringService) =>
{
    if (count <= 0 || count > 100)
        return Results.BadRequest("Count must be between 1 and 100");
    
    var result = await scoringService.GetTopValueStocksAsync(count);
    return Results.Ok(result);
});

// Cache building endpoint
app.MapPost("/api/cache/build", async (ICacheBuildingService cacheBuildingService, CancellationToken cancellationToken) =>
{
    try
    {
        using var timeoutCts = new CancellationTokenSource(TimeSpan.FromMinutes(10));
        using var linkedCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, timeoutCts.Token);
        
        await cacheBuildingService.BuildInitialCacheAsync(linkedCts.Token);
        return Results.Ok(new { Message = "Cache building completed!", Timestamp = DateTime.UtcNow });
    }
    catch (OperationCanceledException)
    {
        return Results.Problem(
            title: "Cache building was cancelled or timed out",
            detail: "The operation was cancelled or exceeded the 10-minute timeout",
            statusCode: 408
        );
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

// Cache status endpoint
app.MapGet("/api/cache/status", async (ICacheService cacheService) =>
{
    try
    {
        var companyKeys = await cacheService.GetAllKeysAsync("company:*");
        var companiesInCache = companyKeys.ToList();
        var totalCount = companiesInCache.Count;
        
        var symbols = companiesInCache
            .Select(key => key.Replace("company:", ""))
            .OrderBy(symbol => symbol)
            .ToList();
        
        return Results.Ok(new 
        { 
            TotalCompanies = totalCount,
            Companies = symbols,
            CacheKeys = companiesInCache,
            Timestamp = DateTime.UtcNow,
            Expected = 20
        });
    }
    catch (Exception ex)
    {
        return Results.Problem(
            title: "Failed to get cache status",
            detail: ex.Message,
            statusCode: 500
        );
    }
});

// Single company cache test endpoint
app.MapPost("/api/cache/build-single/{symbol}", async (string symbol, ICacheBuildingService cacheBuildingService, IAlphaVantageService alphaVantageService, ICacheService cacheService, IScoringService scoringService) =>
{
    try
    {
        var startTime = DateTime.UtcNow;
        
        // Get Alpha Vantage data
        var overview = await alphaVantageService.GetCompanyOverviewAsync(symbol.ToUpper());
        if (overview == null)
        {
            return Results.NotFound($"No data found for symbol: {symbol}");
        }

        // Calculate recommendation and score (same logic as main service)
        var recommendation = scoringService.GetRecommendation(
            overview.PERatio,
            overview.PriceToBookRatio,
            overview.ReturnOnEquityTTM,
            overview.ProfitMargin
        );

        var (_, _, _, _, totalScore) = scoringService.CalculateSimpleScore(overview);

        // Create Company object
        var company = new Company(
            Id: Guid.NewGuid(),
            Name: overview.Name,
            Symbol: overview.Symbol,
            Sector: overview.Sector,
            Industry: overview.Industry,
            MarketCap: overview.MarketCapitalization ?? 0m,
            Price: 0m,
            Change: 0m,
            ChangePercent: 0m,
            Description: overview.Description,
            Recommendation: recommendation,
            Score: totalScore,
            Ratios: new List<FinancialRatio>(),
            OfficialSite: overview.OfficialSite,
            LogoUrl: null
        );

        // Cache the company
        var cacheKey = $"company:{symbol.ToUpper()}";
        await cacheService.SetAsync(cacheKey, company, TimeSpan.FromDays(1));
        
        var duration = DateTime.UtcNow - startTime;
        
        // Verify it was cached
        var cached = await cacheService.ContainsAsync(cacheKey);
        
        return Results.Ok(new 
        { 
            Message = $"Successfully processed {symbol}",
            Symbol = symbol.ToUpper(),
            Duration = duration.TotalMilliseconds,
            Cached = cached,
            Company = company,
            Timestamp = DateTime.UtcNow 
        });
    }
    catch (Exception ex)
    {
        return Results.Problem(
            title: $"Failed to process {symbol}",
            detail: ex.Message,
            statusCode: 500
        );
    }
});




app.Run();
