using Valu.Api.Models;
using Microsoft.Extensions.Logging;

namespace Valu.Api.Services;

public class CompanyService : ICompanyService
{
    private readonly IAlphaVantageService _alphaVantageService;
    private readonly ICacheService _cache;
    private readonly ILogger<CompanyService> _logger;
    private readonly IRecommendationService _recommendationService;

    public CompanyService(IAlphaVantageService alphaVantageService, ICacheService cache, ILogger<CompanyService> logger, IRecommendationService recommendationService)
    {
        _alphaVantageService = alphaVantageService;
        _cache = cache;
        _logger = logger;
        _recommendationService = recommendationService;
    }

    public async Task<IEnumerable<Company>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        // Return all cached companies
        var allCompanies = new List<Company>();
        var cacheKeys = await _cache.GetAllKeysAsync("company:*");
        
        foreach (var key in cacheKeys)
        {
            var company = await _cache.GetAsync<Company>(key);
            if (company != null)
            {
                allCompanies.Add(company);
            }
        }
        
        return allCompanies;
    }

    public async Task<Company?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        // Direct lookup by ID - O(1) complexity
        var cacheKey = $"company_id:{id}";
        var company = await _cache.GetAsync<Company>(cacheKey);
        
        if (company != null)
        {
            return company;
        }
        
        // Fallback: search through cached companies if ID-based cache miss
        // This can happen if the company was cached before the ID-based strategy was implemented
        var allCompanies = await GetAllAsync(cancellationToken);
        var foundCompany = allCompanies.FirstOrDefault(c => c.Id == id);
        
        // If found, cache it with ID-based key for future direct lookup
        if (foundCompany != null)
        {
            await _cache.SetAsync(cacheKey, foundCompany, TimeSpan.FromDays(1));
        }
        
        return foundCompany;
    }

    public async Task<CompanyDetails?> GetDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        // Check cache first for company details
        var detailsCacheKey = $"company_details:{id}";
        var cachedDetails = await _cache.GetAsync<CompanyDetails>(detailsCacheKey);
        if (cachedDetails != null)
        {
            _logger.LogDebug("Returning cached company details for ID: {CompanyId}", id);
            return cachedDetails;
        }
        
        // Find the company by ID
        var company = await GetByIdAsync(id, cancellationToken);
        if (company == null)
        {
            _logger.LogWarning("Company not found for ID: {CompanyId}", id);
            return null;
        }
        
        // Get Alpha Vantage data for this company
        var overview = await _alphaVantageService.GetCompanyOverviewAsync(company.Symbol, cancellationToken);
        if (overview == null)
        {
            _logger.LogWarning("Failed to get Alpha Vantage overview for company symbol: {Symbol}", company.Symbol);
            return null;
        }
        
        // Create simplified CompanyDetails with just the essential data
        var ratios = new List<FinancialRatio>
        {
            new("pe", "P/E Ratio", overview.PERatio ?? 0m, "Price-to-Earnings ratio"),
            new("pb", "P/B Ratio", overview.PriceToBookRatio ?? 0m, "Price-to-Book ratio"),
            new("roe", "ROE", (overview.ReturnOnEquityTTM ?? 0m) * 100, "Return on Equity (TTM)"),
            new("profitMargin", "Profit Margin", (overview.ProfitMargin ?? 0m) * 100, "Profit Margin")
        };

        // Use company's existing score instead of recalculating
        var totalScore = company.Score;
        
        var details = new CompanyDetails(
            Id: company.Id,
            Name: company.Name,
            Symbol: company.Symbol,
            Sector: company.Sector,
            Industry: company.Industry,
            MarketCap: company.MarketCap,
            Price: company.Price,
            Change: company.Change,
            ChangePercent: company.ChangePercent,
            Description: company.Description,
            Score: totalScore,
            Financials: new FinancialMetrics(0, 0, 0, 0, 0, 0), // Not used
            Ratios: ratios
        );
        
        // Cache the company details with appropriate expiration
        // Financial data can be cached for a longer period since it doesn't change frequently
        await _cache.SetAsync(detailsCacheKey, details, TimeSpan.FromHours(6));
        _logger.LogDebug("Cached company details for ID: {CompanyId} with 6-hour expiration", id);
        
        return details;
    }

    public async Task<SearchCompaniesResponse> SearchAsync(string query, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default)
    {
        var q = (query ?? string.Empty).Trim();

        var effectivePage = page < 1 ? 1 : page;
        const int MaxPageSize = 100;
        var effectivePageSize = pageSize <= 0
            ? 20
            : (pageSize > MaxPageSize ? MaxPageSize : pageSize);

        var allResults = new List<Company>();

        // Check if query meets strict symbol criteria (2-5 alphanumeric characters)
        var isStrictSymbolMatch = !string.IsNullOrEmpty(q) && q.Length >= 2 && q.Length <= 5 && q.All(c => char.IsLetterOrDigit(c));

        if (isStrictSymbolMatch)
        {
            // Try Alpha Vantage API for exact symbol match
            try
            {
                var alphaVantageCompany = await GetCompanyFromAlphaVantageAsync(q.ToUpper(), cancellationToken);
                
                if (alphaVantageCompany != null)
                {
                    allResults.Add(alphaVantageCompany);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to search Alpha Vantage API for symbol '{Symbol}': {Message}", q, ex.Message);
            }
        }

        // If no results from Alpha Vantage or query doesn't meet strict criteria, search cached companies
        if (!allResults.Any())
        {
            try
            {
                var cachedCompanies = await GetAllAsync(cancellationToken);
                var searchResults = cachedCompanies
                    .Where(c => 
                        // Search by symbol (case-insensitive)
                        (c.Symbol?.Contains(q, StringComparison.OrdinalIgnoreCase) == true) ||
                        // Search by name (case-insensitive)
                        (c.Name?.Contains(q, StringComparison.OrdinalIgnoreCase) == true) ||
                        // Search by sector (case-insensitive)
                        (c.Sector?.Contains(q, StringComparison.OrdinalIgnoreCase) == true) ||
                        // Search by industry (case-insensitive)
                        (c.Industry?.Contains(q, StringComparison.OrdinalIgnoreCase) == true))
                    .Take(10) // Limit results to prevent performance issues
                    .ToList();

                allResults.AddRange(searchResults);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to search cached companies for query '{Query}': {Message}", q, ex.Message);
            }
        }

        var totalCount = allResults.Count();
        var totalPages = (int)Math.Ceiling((double)totalCount / effectivePageSize);
        var paged = allResults
            .Skip((effectivePage - 1) * effectivePageSize)
            .Take(effectivePageSize)
            .ToList();

        return new SearchCompaniesResponse(
            effectivePage,
            effectivePageSize,
            totalPages,
            totalCount,
            paged
        );
    }



    private Company ConvertToCompany(AlphaVantageOverview overview)
    {
        // Create deterministic GUID from company symbol
        var symbolBytes = System.Text.Encoding.UTF8.GetBytes(overview.Symbol.ToUpperInvariant());
        using var md5 = System.Security.Cryptography.MD5.Create();
        var hashBytes = md5.ComputeHash(symbolBytes);
        var deterministicGuid = new Guid(hashBytes);
        
        // Calculate recommendation using actual financial metrics
        var recommendation = _recommendationService.CalculateRecommendation(
            overview.PERatio,
            overview.PriceToBookRatio,
            overview.ReturnOnEquityTTM,
            overview.ProfitMargin
        );
        
        // Create ratios array from Alpha Vantage data
        var ratios = new List<FinancialRatio>
        {
            new("pe", "P/E Ratio", overview.PERatio ?? 0m, "Price-to-Earnings ratio"),
            new("pb", "P/B Ratio", overview.PriceToBookRatio ?? 0m, "Price-to-Book ratio"),
            new("roe", "ROE", (overview.ReturnOnEquityTTM ?? 0m) * 100, "Return on Equity (TTM)"),
            new("profitMargin", "Profit Margin", (overview.ProfitMargin ?? 0m) * 100, "Profit Margin")
        };

        // Simple score calculation based on key metrics
        var totalScore = CalculateSimpleScore(overview);
        
        var company = new Company(
            Id: deterministicGuid,
            Name: overview.Name,
            Symbol: overview.Symbol,
            Sector: overview.Sector,
            Industry: overview.Industry,
            MarketCap: overview.MarketCapitalization ?? 0m,
            Price: 0m, // Price not available in OVERVIEW, will be updated later if needed
            Change: 0m, // Change not available in OVERVIEW
            ChangePercent: 0m, // Change percent not available in OVERVIEW
            Description: overview.Description,
            Recommendation: recommendation,
            Score: totalScore,
            Ratios: ratios
        );
        
        return company;
    }

    private decimal CalculateSimpleScore(AlphaVantageOverview overview)
    {
        decimal score = 50; // Base score

        // P/E ratio scoring (lower is better, but not too low)
        if (overview.PERatio.HasValue && overview.PERatio > 0)
        {
            if (overview.PERatio <= 15) score += 15;
            else if (overview.PERatio <= 25) score += 10;
            else if (overview.PERatio <= 35) score += 5;
        }

        // ROE scoring (higher is better)
        if (overview.ReturnOnEquityTTM.HasValue)
        {
            var roe = overview.ReturnOnEquityTTM.Value * 100;
            if (roe >= 15) score += 15;
            else if (roe >= 10) score += 10;
            else if (roe >= 5) score += 5;
        }

        // Profit margin scoring (higher is better)
        if (overview.ProfitMargin.HasValue)
        {
            var margin = overview.ProfitMargin.Value * 100;
            if (margin >= 20) score += 10;
            else if (margin >= 10) score += 7;
            else if (margin >= 5) score += 3;
        }

        // P/B ratio scoring (lower is better)
        if (overview.PriceToBookRatio.HasValue && overview.PriceToBookRatio > 0)
        {
            if (overview.PriceToBookRatio <= 1.5m) score += 10;
            else if (overview.PriceToBookRatio <= 3m) score += 5;
        }

        return Math.Min(100, Math.Max(0, score));
    }

    private async Task<Company?> GetCompanyFromAlphaVantageAsync(string symbol, CancellationToken cancellationToken)
    {
        try
        {
            // Check cache first using symbol-based key
            var symbolCacheKey = $"company:{symbol}";
            
            var cached = await _cache.GetAsync<Company>(symbolCacheKey);
            if (cached != null)
            {
                return cached;
            }

            // Fetch overview data only
            var overview = await _alphaVantageService.GetCompanyOverviewAsync(symbol, cancellationToken);
            
            if (overview == null)
            {
                return null;
            }

            // Convert and cache the Company object with both symbol and ID keys
            var company = ConvertToCompany(overview);
            
            // Cache with symbol-based key
            await _cache.SetAsync(symbolCacheKey, company, TimeSpan.FromDays(1));
            
            // Cache with ID-based key for direct lookup
            var idCacheKey = $"company_id:{company.Id}";
            await _cache.SetAsync(idCacheKey, company, TimeSpan.FromDays(1));

            return company;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get company from Alpha Vantage for symbol '{Symbol}': {Message}", symbol, ex.Message);
            return null;
        }
    }


} 