using System.Text.Json.Serialization;

namespace Valu.Api.Models;

// Alpha Vantage API Response Models
public record AlphaVantageOverview(
    string Symbol,
    string Name,
    string Description,
    string Exchange,
    string Currency,
    string Country,
    string Sector,
    string Industry,
    [property: JsonPropertyName("MarketCapitalization")]
    [property: JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
    decimal? MarketCapitalization,
    [property: JsonPropertyName("PERatio")]
    [property: JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
    decimal? PERatio,
    [property: JsonPropertyName("PriceToBookRatio")]
    [property: JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
    decimal? PriceToBookRatio,
    [property: JsonPropertyName("ReturnOnEquityTTM")]
    [property: JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
    decimal? ReturnOnEquityTTM,
    [property: JsonPropertyName("ProfitMargin")]
    [property: JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
    decimal? ProfitMargin,
    [property: JsonPropertyName("EPS")]
    [property: JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
    decimal? EPS,
    [property: JsonPropertyName("BookValue")]
    [property: JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
    decimal? BookValue,
    [property: JsonPropertyName("DividendYield")]
    [property: JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
    decimal? DividendYield,
    [property: JsonPropertyName("QuarterlyEarningsGrowthYOY")]
    [property: JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
    decimal? QuarterlyEarningsGrowthYOY,
    [property: JsonPropertyName("AnalystTargetPrice")]
    [property: JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
    decimal? AnalystTargetPrice,
    [property: JsonPropertyName("Website")]
    string? OfficialSite
);

public record AlphaVantageSearchResult(
    string Symbol,
    string Name,
    string Type,
    string Region,
    string MarketOpen,
    string MarketClose,
    string Timezone,
    string Currency,
    [property: JsonPropertyName("MatchScore")]
    string? MatchScore
);

// Configuration model
public class AlphaVantageOptions
{
    public string ApiKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = string.Empty;
    public int RateLimitPerMinute { get; set; }
    public int RateLimitPerDay { get; set; }

    public void Validate()
    {
        if (string.IsNullOrWhiteSpace(ApiKey))
        {
            throw new InvalidOperationException("AlphaVantage API key is required. Please set it via environment variable 'AlphaVantage__ApiKey' or user secrets.");
        }
        
        if (string.IsNullOrWhiteSpace(BaseUrl))
        {
            throw new InvalidOperationException("AlphaVantage BaseUrl is required.");
        }
    }
} 