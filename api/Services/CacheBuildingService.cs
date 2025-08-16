using Valu.Api.Models;
using Microsoft.Extensions.Logging;

namespace Valu.Api.Services;

public interface ICacheBuildingService
{
    Task BuildInitialCacheAsync(CancellationToken cancellationToken = default);
}

public class CacheBuildingService : ICacheBuildingService
{
    private readonly IAlphaVantageService _alphaVantageService;
    private readonly IRecommendationService _recommendationService;
    private readonly IValueScoreService _valueScoreService;
    private readonly ICacheService _cache;
    private readonly ILogger<CacheBuildingService> _logger;

    // Rate limit tracking
    private int _requestsThisMinute = 0;
    private DateTime _lastMinuteReset = DateTime.UtcNow;

    // Initial 20 companies - balanced sectors
    private readonly string[] _initialCompanies = [
        // Tech (5)
        "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA",
        
        // Retail/Consumer (5)
        "WMT", "HD", "PG", "KO", "PEP",
        
        // Finance (5)
        "JPM", "BAC", "WFC", "GS", "MS",
        
        // Media/Entertainment (5)
        "DIS", "NFLX", "CMCSA", "FOX", "VIAC"
    ];

    public CacheBuildingService(
        IAlphaVantageService alphaVantageService,
        IRecommendationService recommendationService,
        IValueScoreService valueScoreService,
        ICacheService cache,
        ILogger<CacheBuildingService> logger)
    {
        _alphaVantageService = alphaVantageService;
        _recommendationService = recommendationService;
        _valueScoreService = valueScoreService;
        _cache = cache;
        _logger = logger;
    }

    public async Task BuildInitialCacheAsync(CancellationToken cancellationToken = default)
    {
        var successCount = 0;
        var failureCount = 0;
        const int batchSize = 5;
        var startTime = DateTime.UtcNow;
        
        _logger.LogInformation("=== CACHE BUILD START ===");
        _logger.LogInformation("Starting cache build for {CompanyCount} companies in batches of {BatchSize}", 
            _initialCompanies.Length, batchSize);
        _logger.LogInformation("Companies to process: {Companies}", string.Join(", ", _initialCompanies));
        
        // Check initial Redis state
        var initialCacheCount = await GetCurrentCacheCountAsync();
        _logger.LogInformation("Initial Redis cache count: {InitialCount} companies", initialCacheCount);
        
        // Split companies into batches of 5
        var batches = _initialCompanies.Chunk(batchSize).ToArray();
        
        for (var batchIndex = 0; batchIndex < batches.Length; batchIndex++)
        {
            var batch = batches[batchIndex];
            var isLastBatch = batchIndex == batches.Length - 1;
            var batchStartTime = DateTime.UtcNow;
            
            _logger.LogInformation("=== BATCH {BatchNumber}/{TotalBatches} START ===", batchIndex + 1, batches.Length);
            _logger.LogInformation("Processing batch {BatchNumber}/{TotalBatches}: {Companies}", 
                batchIndex + 1, batches.Length, string.Join(", ", batch));
            
            var batchCacheCountBefore = await GetCurrentCacheCountAsync();
            _logger.LogInformation("Cache count before batch {BatchNumber}: {Count} companies", batchIndex + 1, batchCacheCountBefore);
            
            // Process all companies in this batch
            foreach (var symbol in batch)
            {
                try
                {
                    cancellationToken.ThrowIfCancellationRequested();
                    var companyStartTime = DateTime.UtcNow;
                    
                    _logger.LogInformation("Processing company {Symbol}...", symbol);
                    
                    // Get Alpha Vantage data
                    var overview = await _alphaVantageService.GetCompanyOverviewAsync(symbol, cancellationToken);
                    var apiCallDuration = DateTime.UtcNow - companyStartTime;
                    _logger.LogInformation("Alpha Vantage API call for {Symbol} took {Duration}ms", symbol, apiCallDuration.TotalMilliseconds);
                    if (overview == null)
                    {
                        _logger.LogWarning("No data returned for company {Symbol}", symbol);
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

                    // Calculate score using the ValueScoreService
                    var (_, _, _, _, totalScore) = _valueScoreService.CalculateSimpleScore(overview);

                    // Create ratios array from Alpha Vantage data
                    var ratios = new List<FinancialRatio>
                    {
                        new("pe", "P/E Ratio", overview.PERatio ?? 0m, "Price-to-Earnings ratio"),
                        new("pb", "P/B Ratio", overview.PriceToBookRatio ?? 0m, "Price-to-Book ratio"),
                        new("roe", "ROE", (overview.ReturnOnEquityTTM ?? 0m) * 100, "Return on Equity (TTM)"),
                        new("profitMargin", "Profit Margin", (overview.ProfitMargin ?? 0m) * 100, "Profit Margin")
                    };

                    // Extract domain and generate logo URL
                    string? logoUrl = null;
                    if (!string.IsNullOrEmpty(overview.OfficialSite))
                    {
                        var domain = ExtractDomain(overview.OfficialSite);
                        if (!string.IsNullOrEmpty(domain))
                        {
                            logoUrl = $"https://cdn.brandfetch.io/{domain}/w/400/h/400?c=1iduleAyYy1ycpyef1P";
                        }
                    }

                    // Create Company object with calculated score
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
                        Score: totalScore,
                        Ratios: ratios,
                        OfficialSite: overview.OfficialSite,
                        LogoUrl: logoUrl
                    );

                    // Cache for 1 day
                    var cacheKey = $"company:{symbol}";
                    var cacheStartTime = DateTime.UtcNow;
                    await _cache.SetAsync(cacheKey, company, TimeSpan.FromDays(1));
                    var cacheDuration = DateTime.UtcNow - cacheStartTime;
                    
                    successCount++;
                    var totalCompanyDuration = DateTime.UtcNow - companyStartTime;
                    _logger.LogInformation("✅ Successfully processed {Symbol} in {Duration}ms (cache: {CacheDuration}ms)", 
                        symbol, totalCompanyDuration.TotalMilliseconds, cacheDuration.TotalMilliseconds);
                }
                catch (HttpRequestException ex) when (ex.Message.Contains("429")) // Rate limit exceeded
                {
                    _logger.LogWarning("Rate limit exceeded for {Symbol} - this should not happen in batch mode", symbol);
                    failureCount++;
                }
                catch (HttpRequestException ex) when (ex.Message.Contains("5xx")) // Server error
                {
                    _logger.LogError(ex, "Server error for {Symbol}", symbol);
                    failureCount++;
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInformation("Cache building cancelled");
                    throw;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Unexpected error processing {Symbol}", symbol);
                    failureCount++;
                }
            }
            
            var batchDuration = DateTime.UtcNow - batchStartTime;
            var batchCacheCountAfter = await GetCurrentCacheCountAsync();
            var batchCacheIncrease = batchCacheCountAfter - batchCacheCountBefore;
            
            _logger.LogInformation("=== BATCH {BatchNumber}/{TotalBatches} COMPLETED ===", batchIndex + 1, batches.Length);
            _logger.LogInformation("Batch duration: {Duration}ms", batchDuration.TotalMilliseconds);
            _logger.LogInformation("Cache count after batch: {Count} companies (+{Increase})", batchCacheCountAfter, batchCacheIncrease);
            
            // AlphaVantage service now handles rate limiting automatically via semaphore
            // No need to wait between batches
        }

        var totalDuration = DateTime.UtcNow - startTime;
        var finalCacheCount = await GetCurrentCacheCountAsync();
        var totalCacheIncrease = finalCacheCount - initialCacheCount;
        
        _logger.LogInformation("=== CACHE BUILD COMPLETED ===");
        _logger.LogInformation("Total duration: {Duration}ms ({Minutes} minutes)", totalDuration.TotalMilliseconds, totalDuration.TotalMinutes);
        _logger.LogInformation("Successes: {SuccessCount}, Failures: {FailureCount}", successCount, failureCount);
        _logger.LogInformation("Final cache count: {FinalCount} companies (+{TotalIncrease} from start)", finalCacheCount, totalCacheIncrease);
        _logger.LogInformation("Expected companies: {Expected}, Actual: {Actual}", _initialCompanies.Length, finalCacheCount);
        
        if (finalCacheCount != _initialCompanies.Length)
        {
            _logger.LogWarning("⚠️  Cache count mismatch! Expected {Expected} but got {Actual}", _initialCompanies.Length, finalCacheCount);
        }
    }

    private async Task<int> GetCurrentCacheCountAsync()
    {
        try
        {
            var count = 0;
            foreach (var symbol in _initialCompanies)
            {
                var cacheKey = $"company:{symbol}";
                var exists = await _cache.ContainsAsync(cacheKey);
                if (exists) count++;
            }
            return count;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to get current cache count");
            return -1;
        }
    }

    private string? ExtractDomain(string officialSite)
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
            _logger.LogWarning(ex, "Failed to extract domain from OfficialSite: {OfficialSite}", officialSite);
            return null;
        }
    }
} 