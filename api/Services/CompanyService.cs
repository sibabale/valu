using Valu.Api.Models;

namespace Valu.Api.Services;

public class CompanyService : ICompanyService
{
    private readonly List<Company> _companies;
    private readonly List<CompanyDetails> _companyDetails;
    private readonly IAlphaVantageService _alphaVantageService;
    private readonly SimpleCache _cache;

    public CompanyService(IAlphaVantageService alphaVantageService, SimpleCache cache)
    {
        _alphaVantageService = alphaVantageService;
        _cache = cache;
        
        // Initialize empty lists - all data will come from Alpha Vantage
        _companies = new List<Company>();
        _companyDetails = new List<CompanyDetails>();
    }

    public Task<IEnumerable<Company>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        // Return all cached companies
        var allCompanies = new List<Company>();
        var cacheKeys = _cache.GetAllKeys().Where(k => k.StartsWith("company_"));
        
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
        // Search through cached companies
        var allCompanies = await GetAllAsync(cancellationToken);
        return allCompanies.FirstOrDefault(c => c.Id == id);
    }

    public async Task<CompanyDetails?> GetDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        // Find the company by ID
        var company = await GetByIdAsync(id, cancellationToken);
        if (company == null)
        {
            return null;
        }
        
        // Get Alpha Vantage data for this company
        var overview = await _alphaVantageService.GetCompanyOverviewAsync(company.Symbol, cancellationToken);
        if (overview == null)
        {
            return null;
        }
        
        // Convert to CompanyDetails with real financial ratios
        var details = ConvertToCompanyDetails(company, overview);
        
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

        // Only search Alpha Vantage - no mock data
        if (!string.IsNullOrEmpty(q) && q.Length >= 2 && q.Length <= 5 && q.All(c => char.IsLetterOrDigit(c)))
        {
            try
            {
                var alphaVantageCompany = await GetCompanyFromAlphaVantageAsync(q.ToUpper(), cancellationToken);
                
                if (alphaVantageCompany != null)
                {
                    allResults.Add(alphaVantageCompany);
                }
            }
            catch (Exception)
            {
                // Return empty results if Alpha Vantage fails
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

    public async Task<IEnumerable<Company>> GetPopularStocksAsync(CancellationToken cancellationToken = default)
    {
        // Return all cached companies as "popular" for now
        var allCompanies = await GetAllAsync(cancellationToken);
        return allCompanies.Take(5);
    }

    private Company ConvertToCompany(AlphaVantageOverview overview)
    {
        var company = new Company(
            Id: Guid.NewGuid(), // Generate new ID for Alpha Vantage companies
            Name: overview.Name,
            Symbol: overview.Symbol,
            Sector: overview.Sector,
            Industry: overview.Industry,
            MarketCap: overview.MarketCapitalization,
            Price: 0m, // Price not available in OVERVIEW, will be updated later if needed
            Change: 0m, // Change not available in OVERVIEW
            ChangePercent: 0m, // Change percent not available in OVERVIEW
            Description: overview.Description
        );
        
        return company;
    }

    private async Task<Company?> GetCompanyFromAlphaVantageAsync(string symbol, CancellationToken cancellationToken)
    {
        try
        {
            // Check cache first
            var cacheKey = $"company_{symbol}";
            
            var cached = _cache.Get<Company>(cacheKey);
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

            // Convert and cache the Company object
            var company = ConvertToCompany(overview);
            
            _cache.Set(cacheKey, company, TimeSpan.FromDays(1));

            return company;
        }
        catch (Exception)
        {
            return null;
        }
    }

    private CompanyDetails ConvertToCompanyDetails(Company company, AlphaVantageOverview overview)
    {
        // Create financial metrics (using available data)
        var financials = new FinancialMetrics(
            Cash: 0, // Not available in OVERVIEW
            Debt: 0, // Not available in OVERVIEW
            Revenue: 0, // Not available in OVERVIEW
            NetIncome: overview.EPS * overview.MarketCapitalization / company.Price, // Estimate from EPS
            TotalAssets: 0, // Not available in OVERVIEW
            TotalLiabilities: 0 // Not available in OVERVIEW
        );
        
        // Create real financial ratios from Alpha Vantage data
        var ratios = new List<FinancialRatio>
        {
            new("P/E Ratio", overview.PERatio, "Price-to-Earnings ratio"),
            new("P/B Ratio", overview.PriceToBookRatio, "Price-to-Book ratio"),
            new("ROE", overview.ReturnOnEquityTTM * 100, "Return on Equity (TTM)"), // Convert to percentage
            new("Profit Margin", overview.ProfitMargin * 100, "Profit Margin") // Convert to percentage
        };
        
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
            Financials: financials,
            Ratios: ratios
        );
        
        return details;
    }
} 