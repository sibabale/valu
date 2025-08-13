using Valu.Api.Models;
using Microsoft.Extensions.Logging;

namespace Valu.Api.Services;

public class CompanyService : ICompanyService
{
    private readonly IAlphaVantageService _alphaVantageService;
    private readonly SimpleCache _cache;
    private readonly ILogger<CompanyService> _logger;
    private readonly IRecommendationService _recommendationService;
    private readonly IValueScoreService _valueScoreService;

    public CompanyService(IAlphaVantageService alphaVantageService, SimpleCache cache, ILogger<CompanyService> logger, IRecommendationService recommendationService, IValueScoreService valueScoreService)
    {
        _alphaVantageService = alphaVantageService;
        _cache = cache;
        _logger = logger;
        _recommendationService = recommendationService;
        _valueScoreService = valueScoreService;
    }

    public Task<IEnumerable<Company>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        // Return all cached companies
        var allCompanies = new List<Company>();
        var cacheKeys = _cache.GetAllKeys()?.Where(k => k.StartsWith("company_symbol_")) ?? Enumerable.Empty<string>();
        
        foreach (var key in cacheKeys)
        {
            var company = _cache.Get<Company>(key);
            if (company != null)
            {
                allCompanies.Add(company);
            }
        }
        
        return Task.FromResult<IEnumerable<Company>>(allCompanies);
    }

    public async Task<Company?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        // Direct lookup by ID - O(1) complexity
        var cacheKey = $"company_id_{id}";
        var company = _cache.Get<Company>(cacheKey);
        
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
            _cache.Set(cacheKey, foundCompany, TimeSpan.FromDays(1));
        }
        
        return foundCompany;
    }

    public async Task<CompanyDetails?> GetDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        // Check cache first for company details
        var detailsCacheKey = $"company_details_{id}";
        var cachedDetails = _cache.Get<CompanyDetails>(detailsCacheKey);
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

        // Calculate score using the ValueScoreService
        var (_, _, _, _, totalScore) = _valueScoreService.CalculateSimpleScore(overview);
        
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
        _cache.Set(detailsCacheKey, details, TimeSpan.FromHours(6));
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

        // Calculate score using the ValueScoreService
        var (_, _, _, _, totalScore) = _valueScoreService.CalculateSimpleScore(overview);
        
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

    private async Task<Company?> GetCompanyFromAlphaVantageAsync(string symbol, CancellationToken cancellationToken)
    {
        try
        {
            // Check cache first using symbol-based key
            var symbolCacheKey = $"company_symbol_{symbol}";
            
            var cached = _cache.Get<Company>(symbolCacheKey);
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
            _cache.Set(symbolCacheKey, company, TimeSpan.FromDays(1));
            
            // Cache with ID-based key for direct lookup
            var idCacheKey = $"company_id_{company.Id}";
            _cache.Set(idCacheKey, company, TimeSpan.FromDays(1));

            return company;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get company from Alpha Vantage for symbol '{Symbol}': {Message}", symbol, ex.Message);
            return null;
        }
    }


} 