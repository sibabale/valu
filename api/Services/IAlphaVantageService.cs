using Valu.Api.Models;

namespace Valu.Api.Services;

public interface IAlphaVantageService
{
    Task<AlphaVantageOverview?> GetCompanyOverviewAsync(string symbol, CancellationToken cancellationToken = default);
    Task<IEnumerable<AlphaVantageSearchResult>> SearchCompaniesAsync(string query, CancellationToken cancellationToken = default);
} 