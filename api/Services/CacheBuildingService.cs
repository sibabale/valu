using Valu.Api.Models;

namespace Valu.Api.Services;

public interface ICacheBuildingService
{
    Task BuildInitialCacheAsync(CancellationToken cancellationToken = default);
}

public class CacheBuildingService : ICacheBuildingService
{
    private readonly IAlphaVantageService _alphaVantageService;
    private readonly IRecommendationService _recommendationService;
    private readonly SimpleCache _cache;
    private readonly ILogger<CacheBuildingService> _logger;

    // Initial 5 companies for MVP
    private readonly string[] _initialCompanies = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"];

    public CacheBuildingService(
        IAlphaVantageService alphaVantageService,
        IRecommendationService recommendationService,
        SimpleCache cache,
        ILogger<CacheBuildingService> logger)
    {
        _alphaVantageService = alphaVantageService;
        _recommendationService = recommendationService;
        _cache = cache;
        _logger = logger;
    }

    public async Task BuildInitialCacheAsync(CancellationToken cancellationToken = default)
    {
        var successCount = 0;
        var failureCount = 0;
        
        foreach (var symbol in _initialCompanies)
        {
            try
            {
                // Get Alpha Vantage data
                var overview = await _alphaVantageService.GetCompanyOverviewAsync(symbol, cancellationToken);
                if (overview == null)
                {
                    failureCount++;
                    continue;
                }

                // Calculate recommendation using financial metrics
                var recommendation = _recommendationService.CalculateRecommendation(
                    overview.PERatio,
                    overview.PriceToBookRatio,
                    overview.ReturnOnEquityTTM,
                    overview.ProfitMargin
                );

                // Create ratios array from Alpha Vantage data
                var ratios = new List<FinancialRatio>
                {
                    new("P/E Ratio", overview.PERatio ?? 0m, "Price-to-Earnings ratio"),
                    new("P/B Ratio", overview.PriceToBookRatio ?? 0m, "Price-to-Book ratio"),
                    new("ROE", (overview.ReturnOnEquityTTM ?? 0m) * 100, "Return on Equity (TTM)"),
                    new("Profit Margin", (overview.ProfitMargin ?? 0m) * 100, "Profit Margin")
                };

                // Create Company object with calculated recommendation
                var company = new Company(
                    Id: Guid.NewGuid(),
                    Name: overview.Name,
                    Symbol: overview.Symbol,
                    Sector: overview.Sector,
                    Industry: overview.Industry,
                    MarketCap: overview.MarketCapitalization ?? 0m,
                    Price: 0m, // Not available in OVERVIEW
                    Change: 0m, // Not available in OVERVIEW
                    ChangePercent: 0m, // Not available in OVERVIEW
                    Description: overview.Description,
                    Recommendation: recommendation,
                    Ratios: ratios
                );

                // Cache for 1 day
                var cacheKey = $"company_symbol_{symbol}";
                _cache.Set(cacheKey, company, TimeSpan.FromDays(1));
                
                successCount++;

                // Wait 12 seconds between calls (5 calls per minute = 12 seconds per call)
                if (symbol != _initialCompanies[^1])
                {
                    await Task.Delay(12000, cancellationToken);
                }
            }
            catch (OperationCanceledException)
            {
                // Re-throw cancellation exceptions to allow cancellation to propagate
                throw;
            }
            catch (Exception)
            {
                failureCount++;
            }
        }

        _logger.LogInformation("Cache building completed. Successes: {SuccessCount}, Failures: {FailureCount}", successCount, failureCount);
    }
} 