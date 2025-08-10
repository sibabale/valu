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
    decimal MarketCapitalization,
    decimal PERatio,
    decimal PriceToBookRatio,
    decimal ReturnOnEquityTTM,
    decimal ProfitMargin, // Replace DebtToEquityRatio with ProfitMargin
    decimal EPS,
    decimal BookValue,
    decimal DividendYield,
    decimal QuarterlyEarningsGrowthYOY,
    decimal AnalystTargetPrice
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
    decimal MatchScore
);

// Configuration model
public class AlphaVantageOptions
{
    public string ApiKey { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = string.Empty;
    public int RateLimitPerMinute { get; set; }
    public int RateLimitPerDay { get; set; }
} 