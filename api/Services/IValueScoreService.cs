using Valu.Api.Models;
using System.Threading;

namespace Valu.Api.Services;

public interface IValueScoreService
{
    Task<ValueScore> CalculateValueScoreAsync(CalculateValueScoreRequest request, CancellationToken cancellationToken = default);
    Task<ValueScore?> GetValueScoreAsync(Guid companyId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ValueScore>> GetTopValueStocksAsync(int count = 10, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Calculates individual component scores and total score for a company overview.
    /// This method is designed for use by other services that need simple scoring.
    /// </summary>
    /// <param name="overview">The Alpha Vantage overview data</param>
    /// <returns>Tuple containing individual scores and total score</returns>
    (int peScore, int pbScore, int roeScore, int profitMarginScore, decimal totalScore) CalculateSimpleScore(AlphaVantageOverview overview);
} 