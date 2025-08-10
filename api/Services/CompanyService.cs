using Valu.Api.Models;

namespace Valu.Api.Services;

public class CompanyService : ICompanyService
{
    private readonly List<Company> _companies;
    private readonly List<CompanyDetails> _companyDetails;

    public CompanyService()
    {
        // Mock data based on your React Native app
        _companies = new List<Company>
        {
            new(Guid.Parse("11111111-1111-1111-1111-111111111111"), "Apple Inc.", "AAPL", "Technology", "Consumer Electronics", 3000000000000m, 150.00m, 2.50m, 1.67m, "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide."),
            new(Guid.Parse("22222222-2222-2222-2222-222222222222"), "Microsoft Corporation", "MSFT", "Technology", "Software", 2800000000000m, 280.00m, -1.20m, -0.43m, "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide."),
            new(Guid.Parse("33333333-3333-3333-3333-333333333333"), "Alphabet Inc.", "GOOGL", "Technology", "Internet Content & Information", 1800000000000m, 140.00m, 0.80m, 0.57m, "Alphabet Inc. provides online advertising services in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America."),
            new(Guid.Parse("44444444-4444-4444-4444-444444444444"), "Amazon.com Inc.", "AMZN", "Consumer Cyclical", "Internet Retail", 1600000000000m, 130.00m, 1.50m, 1.17m, "Amazon.com Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally."),
            new(Guid.Parse("55555555-5555-5555-5555-555555555555"), "Tesla Inc.", "TSLA", "Consumer Cyclical", "Auto Manufacturers", 800000000000m, 200.00m, -5.00m, -2.44m, "Tesla Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.")
        };

        _companyDetails = _companies.Select(c => new CompanyDetails(
            c.Id,
            c.Name,
            c.Symbol,
            c.Sector,
            c.Industry,
            c.MarketCap,
            c.Price,
            c.Change,
            c.ChangePercent,
            c.Description,
            new FinancialMetrics(
                Cash: Random.Shared.Next(100000000, 1000000000),
                Debt: Random.Shared.Next(50000000, 500000000),
                Revenue: Random.Shared.Next(100000000, 2000000000),
                NetIncome: Random.Shared.Next(10000000, 500000000),
                TotalAssets: Random.Shared.Next(500000000, 2000000000),
                TotalLiabilities: Random.Shared.Next(200000000, 1000000000)
            ),
            new List<FinancialRatio>
            {
                new("P/E Ratio", Random.Shared.Next(10, 50), "Price-to-Earnings ratio"),
                new("P/B Ratio", Random.Shared.Next(1, 10), "Price-to-Book ratio"),
                new("ROE", Random.Shared.Next(5, 25), "Return on Equity"),
                new("Debt-to-Equity", Random.Shared.Next(10, 100) / 100m, "Debt-to-Equity ratio")
            }
        )).ToList();
    }

    public async Task<IEnumerable<Company>> GetAllAsync()
    {
        await Task.Delay(100); // Simulate async operation
        return _companies.AsReadOnly();
    }

    public async Task<Company?> GetByIdAsync(Guid id)
    {
        await Task.Delay(100);
        return _companies.FirstOrDefault(c => c.Id == id);
    }

    public async Task<CompanyDetails?> GetDetailsAsync(Guid id)
    {
        await Task.Delay(100);
        return _companyDetails.FirstOrDefault(c => c.Id == id);
    }

    public async Task<SearchCompaniesResponse> SearchAsync(string query, int page = 1, int pageSize = 20)
    {
        await Task.Delay(100);
        var q = (query ?? string.Empty).Trim();

        var effectivePage = page < 1 ? 1 : page;
        const int MaxPageSize = 100;
        var effectivePageSize = pageSize <= 0
            ? 20
            : (pageSize > MaxPageSize ? MaxPageSize : pageSize);

        var source = string.IsNullOrEmpty(q)
            ? _companies.AsEnumerable()
            : _companies.Where(c =>
                c.Name.Contains(q, StringComparison.OrdinalIgnoreCase) ||
                c.Symbol.Contains(q, StringComparison.OrdinalIgnoreCase) ||
                c.Sector.Contains(q, StringComparison.OrdinalIgnoreCase) ||
                c.Industry.Contains(q, StringComparison.OrdinalIgnoreCase));

        var totalCount = source.Count();
        var totalPages = (int)Math.Ceiling((double)totalCount / effectivePageSize);
        var paged = source
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

    public async Task<IEnumerable<Company>> GetPopularStocksAsync()
    {
        await Task.Delay(100);
        return _companies.Take(5); // Return top 5 as popular
    }
} 