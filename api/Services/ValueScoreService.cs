using Valu.Api.Models;
using System.Collections.Concurrent;

namespace Valu.Api.Services;

public class ValueScoreService : IValueScoreService
{
    private readonly ICompanyService _companyService;
    private readonly IAlphaVantageService _alphaVantageService;
    private readonly IScoringService _scoringService;
    private readonly ConcurrentDictionary<Guid, ValueScore> _cachedScores = new();

    public ValueScoreService(ICompanyService companyService, IAlphaVantageService alphaVantageService, IScoringService scoringService)
    {
        _companyService = companyService;
        _alphaVantageService = alphaVantageService;
        _scoringService = scoringService;
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

        // Use centralized scoring service
        var compositeScore = _scoringService.CalculateCompositeScore(overview);
        var grade = GetGrade(compositeScore.TotalScore);

        var components = compositeScore.Components.Select(c => new ScoreComponent(c.Name, GetWeight(c.Name), c.Score, c.Assessment)).ToList();
        
        var valueScore = new ValueScore(
            company.Id,
            company.Name,
            company.Symbol,
            compositeScore.TotalScore,
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

    public (int peScore, int pbScore, int roeScore, int profitMarginScore, decimal totalScore) CalculateSimpleScore(AlphaVantageOverview overview)
    {
        return _scoringService.CalculateSimpleScore(overview);
    }

    // Private helper methods
    private decimal GetWeight(string metricName)
    {
        return metricName switch
        {
            "P/E Ratio" => ScoringConstants.Weights.PERatio,
            "P/B Ratio" => ScoringConstants.Weights.PBRatio,
            "ROE" => ScoringConstants.Weights.ROE,
            "Profit Margin" => ScoringConstants.Weights.ProfitMargin,
            _ => 0m
        };
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
}
