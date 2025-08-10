using System.Globalization;
using System.Text.Json;
using Microsoft.Extensions.Options;
using Valu.Api.Models;

namespace Valu.Api.Services;

public class AlphaVantageService : IAlphaVantageService
{
    private readonly HttpClient _httpClient;
    private readonly AlphaVantageOptions _options;
    private readonly Queue<DateTime> _apiCalls = new();
    private readonly object _rateLimitLock = new();

    public AlphaVantageService(HttpClient httpClient, IOptions<AlphaVantageOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<AlphaVantageOverview?> GetCompanyOverviewAsync(string symbol, CancellationToken cancellationToken = default)
    {
        await WaitForRateLimitAsync(cancellationToken);
        
        var url = $"{_options.BaseUrl}?function=OVERVIEW&symbol={symbol}&apikey={_options.ApiKey}";
        var response = await _httpClient.GetStringAsync(url, cancellationToken);
        
        using var jsonDoc = JsonDocument.Parse(response);
        var root = jsonDoc.RootElement;
        
        // Check if we got valid data (not error message)
        if (!root.TryGetProperty("Symbol", out var symbolElement))
            return null;
            
        return new AlphaVantageOverview(
            Symbol: GetStringValue(root, "Symbol"),
            Name: GetStringValue(root, "Name"),
            Description: GetStringValue(root, "Description"),
            Exchange: GetStringValue(root, "Exchange"),
            Currency: GetStringValue(root, "Currency"),
            Country: GetStringValue(root, "Country"),
            Sector: GetStringValue(root, "Sector"),
            Industry: GetStringValue(root, "Industry"),
            MarketCapitalization: GetDecimalValue(root, "MarketCapitalization"),
            PERatio: GetDecimalValue(root, "PERatio"),
            PriceToBookRatio: GetDecimalValue(root, "PriceToBookRatio"),
            ReturnOnEquityTTM: GetDecimalValue(root, "ReturnOnEquityTTM"),
            ProfitMargin: GetDecimalValue(root, "ProfitMargin"),
            EPS: GetDecimalValue(root, "EPS"),
            BookValue: GetDecimalValue(root, "BookValue"),
            DividendYield: GetDecimalValue(root, "DividendYield"),
            QuarterlyEarningsGrowthYOY: GetDecimalValue(root, "QuarterlyEarningsGrowthYOY"),
            AnalystTargetPrice: GetDecimalValue(root, "AnalystTargetPrice")
        );
    }

    public async Task<IEnumerable<AlphaVantageSearchResult>> SearchCompaniesAsync(string query, CancellationToken cancellationToken = default)
    {
        await WaitForRateLimitAsync(cancellationToken);
        
        var url = $"{_options.BaseUrl}?function=SYMBOL_SEARCH&keywords={Uri.EscapeDataString(query)}&apikey={_options.ApiKey}";
        var response = await _httpClient.GetStringAsync(url, cancellationToken);
        
        using var jsonDoc = JsonDocument.Parse(response);
        var root = jsonDoc.RootElement;
        
        if (!root.TryGetProperty("bestMatches", out var matchesElement))
            return Enumerable.Empty<AlphaVantageSearchResult>();
            
        var results = new List<AlphaVantageSearchResult>();
        
        foreach (var match in matchesElement.EnumerateArray())
        {
            var result = new AlphaVantageSearchResult(
                Symbol: GetStringValue(match, "1. symbol"),
                Name: GetStringValue(match, "2. name"),
                Type: GetStringValue(match, "3. type"),
                Region: GetStringValue(match, "4. region"),
                MarketOpen: GetStringValue(match, "5. marketOpen"),
                MarketClose: GetStringValue(match, "6. marketClose"),
                Timezone: GetStringValue(match, "7. timezone"),
                Currency: GetStringValue(match, "8. currency"),
                MatchScore: GetStringValue(match, "9. matchScore")
            );
            results.Add(result);
        }
        
        return results;
    }

    private async Task WaitForRateLimitAsync(CancellationToken cancellationToken = default)
    {
        TimeSpan waitTime = TimeSpan.Zero;
        
        lock (_rateLimitLock)
        {
            // Remove old calls (older than 1 minute)
            while (_apiCalls.Count > 0 && DateTime.UtcNow - _apiCalls.Peek() > TimeSpan.FromMinutes(1))
            {
                _apiCalls.Dequeue();
            }
            
            // If we've made too many calls, calculate wait time
            if (_apiCalls.Count >= _options.RateLimitPerMinute)
            {
                var oldestCall = _apiCalls.Peek();
                waitTime = TimeSpan.FromMinutes(1) - (DateTime.UtcNow - oldestCall);
                if (waitTime <= TimeSpan.Zero)
                {
                    waitTime = TimeSpan.Zero;
                }
            }
            
            // Only enqueue if we're not waiting (will enqueue after wait if needed)
            if (waitTime == TimeSpan.Zero)
            {
                _apiCalls.Enqueue(DateTime.UtcNow);
            }
        }
        
        // Wait outside the lock to avoid blocking other requests
        if (waitTime > TimeSpan.Zero)
        {
            await Task.Delay(waitTime, cancellationToken);
            
            // Re-acquire lock to enqueue the call after waiting
            lock (_rateLimitLock)
            {
                _apiCalls.Enqueue(DateTime.UtcNow);
            }
        }
    }

    private static string GetStringValue(JsonElement element, string propertyName)
    {
        return element.TryGetProperty(propertyName, out var prop) ? prop.GetString() ?? "" : "";
    }

    private static decimal GetDecimalValue(JsonElement element, string propertyName)
    {
        if (!element.TryGetProperty(propertyName, out var prop))
            return 0;
            
        var value = prop.GetString();
        if (string.IsNullOrEmpty(value) || value == "None")
            return 0;
            
        return decimal.TryParse(value, CultureInfo.InvariantCulture, out var result) ? result : 0;
    }
} 