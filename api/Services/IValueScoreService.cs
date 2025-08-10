using Valu.Api.Models;
using System.Threading;

namespace Valu.Api.Services;

public interface IValueScoreService
{
    Task<ValueScore> CalculateValueScoreAsync(CalculateValueScoreRequest request, CancellationToken cancellationToken = default);
    Task<ValueScore?> GetValueScoreAsync(Guid companyId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ValueScore>> GetTopValueStocksAsync(int count = 10, CancellationToken cancellationToken = default);
} 