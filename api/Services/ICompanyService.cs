using Valu.Api.Models;

namespace Valu.Api.Services;

public interface ICompanyService
{
    Task<IEnumerable<Company>> GetAllAsync();
    Task<Company?> GetByIdAsync(Guid id);
    Task<CompanyDetails?> GetDetailsAsync(Guid id);
    Task<SearchCompaniesResponse> SearchAsync(string query, int page = 1, int pageSize = 20);
    Task<IEnumerable<Company>> GetPopularStocksAsync();
} 