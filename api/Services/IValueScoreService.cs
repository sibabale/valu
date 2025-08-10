using Valu.Api.Models;

namespace Valu.Api.Services;

public interface IValueScoreService
{
    Task<ValueScore> CalculateValueScoreAsync(CalculateValueScoreRequest request);
    Task<ValueScore?> GetValueScoreAsync(Guid companyId);
    Task<IEnumerable<ValueScore>> GetTopValueStocksAsync(int count = 10);
} 