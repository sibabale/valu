using Valu.Api.Models;
using System.Collections.Concurrent;

namespace Valu.Api.Services;

public class ValueScoreService : IValueScoreService
{
    private readonly ICompanyService _companyService;
    private readonly IAlphaVantageService _alphaVantageService;
    private readonly ConcurrentDictionary<Guid, ValueScore> _cachedScores = new();

    public ValueScoreService(ICompanyService companyService, IAlphaVantageService alphaVantageService)
    {
        _companyService = companyService;
        _alphaVantageService = alphaVantageService;
    }

    public async Task<ValueScore> CalculateValueScoreAsync(CalculateValueScoreRequest request, CancellationToken cancellationToken = default)
    {
        var company = await _companyService.GetByIdAsync(request.CompanyId, cancellationToken);
        if (company == null)
            throw new ArgumentException("Company not found", nameof(request.CompanyId));

        // Get Alpha Vantage data directly for scoring
        var overview = await _alphaVantageService.GetCompanyOverviewAsync(company.Symbol, cancellationToken);
        if (overview == null)
            throw new ArgumentException("Company financial data not found", nameof(request.CompanyId));

        // Simple value scoring algorithm using Alpha Vantage data directly
        var components = new List<ScoreComponent>
        {
            CalculatePERatioScore(overview),
            CalculatePBRatioScore(overview),
            CalculateROEScore(overview),
            CalculateProfitMarginScore(overview)
        };

        var totalScore = components.Sum(c => c.Score * c.Weight);
        var grade = GetGrade(totalScore);

        var valueScore = new ValueScore(
            company.Id,
            company.Name,
            company.Symbol,
            totalScore,
            grade,
            components,
            DateTime.UtcNow
        );

        _cachedScores[company.Id] = valueScore;
        return valueScore;
    }

    public async Task<ValueScore?> GetValueScoreAsync(Guid companyId, CancellationToken cancellationToken = default)
    {
        if (_cachedScores.TryGetValue(companyId, out var cachedScore))
            return cachedScore;

        return await CalculateValueScoreAsync(new CalculateValueScoreRequest(companyId), cancellationToken);
    }

    public async Task<IEnumerable<ValueScore>> GetTopValueStocksAsync(int count = 10, CancellationToken cancellationToken = default)
    {
        var companies = await _companyService.GetAllAsync(cancellationToken);
        var scores = new List<ValueScore>();

        foreach (var company in companies.Take(count))
        {
            var score = await CalculateValueScoreAsync(new CalculateValueScoreRequest(company.Id), cancellationToken);
            scores.Add(score);
        }

        return scores.OrderByDescending(s => s.Score);
    }

    private ScoreComponent CalculatePERatioScore(AlphaVantageOverview overview)
    {
        var peRatio = overview.PERatio;
        var score = peRatio < 15m ? 100 : peRatio < 25m ? 75 : peRatio < 35m ? 50 : 25;
        
        return new ScoreComponent("P/E Ratio", 0.3m, score, $"P/E Ratio of {peRatio:F2}");
    }

    private ScoreComponent CalculatePBRatioScore(AlphaVantageOverview overview)
    {
        var pbRatio = overview.PriceToBookRatio;
        var score = pbRatio < 1.5m ? 100 : pbRatio < 3m ? 75 : pbRatio < 5m ? 50 : 25;
        
        return new ScoreComponent("P/B Ratio", 0.25m, score, $"P/B Ratio of {pbRatio:F2}");
    }

    private ScoreComponent CalculateROEScore(AlphaVantageOverview overview)
    {
        var roe = overview.ReturnOnEquityTTM * 100; // Convert to percentage
        var score = roe > 20m ? 100 : roe > 15m ? 75 : roe > 10m ? 50 : 25;
        
        return new ScoreComponent("ROE", 0.25m, score, $"ROE of {roe:F1}%");
    }

    private ScoreComponent CalculateProfitMarginScore(AlphaVantageOverview overview)
    {
        var profitMargin = overview.ProfitMargin * 100; // Convert to percentage
        var score = profitMargin > 15m ? 100 : profitMargin > 10m ? 75 : profitMargin > 5m ? 50 : 25;
        
        return new ScoreComponent("Profit Margin", 0.2m, score, $"Profit Margin of {profitMargin:F1}%");
    }

    private string GetGrade(decimal score)
    {
        return score switch
        {
            >= 80 => "A",
            >= 70 => "B",
            >= 60 => "C",
            >= 50 => "D",
            _ => "F"
        };
    }

    public (int peScore, int pbScore, int roeScore, int profitMarginScore, decimal totalScore) CalculateSimpleScore(AlphaVantageOverview overview)
    {
        // Calculate score using the same logic as the individual methods but with null handling
        var peScore = (overview.PERatio ?? 0m) < 15m ? 100 : (overview.PERatio ?? 0m) < 25m ? 75 : (overview.PERatio ?? 0m) < 35m ? 50 : 25;
        var pbScore = (overview.PriceToBookRatio ?? 0m) < 1.5m ? 100 : (overview.PriceToBookRatio ?? 0m) < 3m ? 75 : (overview.PriceToBookRatio ?? 0m) < 5m ? 50 : 25;
        var roeScore = (overview.ReturnOnEquityTTM ?? 0m) * 100 > 20m ? 100 : (overview.ReturnOnEquityTTM ?? 0m) * 100 > 15m ? 75 : (overview.ReturnOnEquityTTM ?? 0m) * 100 > 10m ? 50 : 25;
        var profitMarginScore = (overview.ProfitMargin ?? 0m) * 100 > 25m ? 100 : (overview.ProfitMargin ?? 0m) * 100 > 15m ? 75 : (overview.ProfitMargin ?? 0m) * 100 > 10m ? 50 : 25;
        
        var totalScore = (peScore * 0.3m + pbScore * 0.25m + roeScore * 0.25m + profitMarginScore * 0.2m);
        
        return (peScore, pbScore, roeScore, profitMarginScore, totalScore);
    }
} 