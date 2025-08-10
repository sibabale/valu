using System.Threading;
using Valu.Api.Models;

namespace Valu.Api.Services;

public interface ICompanyService
{
    Task<IEnumerable<Company>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Company?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CompanyDetails?> GetDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<SearchCompaniesResponse> SearchAsync(string query, int page = 1, int pageSize = 20, CancellationToken cancellationToken = default);
    Task<IEnumerable<Company>> GetPopularStocksAsync(CancellationToken cancellationToken = default);
} 