using Valu.Api.Services;
using Valu.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IValueScoreService, ValueScoreService>();

// Add CORS for React Native client
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactNative", policy =>
    {
        policy.WithOrigins("http://localhost:19006", "http://localhost:19000") // Expo dev server
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Use CORS
app.UseCors("AllowReactNative");

// Add request logging middleware
app.Use(async (context, next) =>
{
    var startTime = DateTime.UtcNow;
    var originalBodyStream = context.Response.Body;

    using var memoryStream = new MemoryStream();
    context.Response.Body = memoryStream;

    await next();

    memoryStream.Position = 0;
    await memoryStream.CopyToAsync(originalBodyStream);

    var duration = DateTime.UtcNow - startTime;
    var statusCode = context.Response.StatusCode;
    var method = context.Request.Method;
    var path = context.Request.Path + context.Request.QueryString;

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

app.MapGet("/api/companies/popular", async (ICompanyService service) =>
{
    var popular = await service.GetPopularStocksAsync();
    return Results.Ok(new { Stocks = popular });
});

// Value scoring endpoints
app.MapPost("/api/value-score/calculate", async (IValueScoreService service, CalculateValueScoreRequest request) =>
{
    try
    {
        var score = await service.CalculateValueScoreAsync(request);
        return Results.Ok(score);
    }
    catch (ArgumentException ex)
    {
        return Results.BadRequest(new { Error = ex.Message });
    }
});

app.MapGet("/api/value-score/{companyId:guid}", async (Guid companyId, IValueScoreService service) =>
{
    var score = await service.GetValueScoreAsync(companyId);
    return score is null ? Results.NotFound() : Results.Ok(score);
});

app.MapGet("/api/value-score/top", async (IValueScoreService service, int count = 10) =>
{
    var topStocks = await service.GetTopValueStocksAsync(count);
    return Results.Ok(new { TopStocks = topStocks });
});

app.Run();
