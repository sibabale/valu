using Valu.Api.Models;
using System.Collections.Concurrent;

namespace Valu.Api.Services;

public interface IScoringService
{
    // Individual metric scoring
    MetricScore CalculatePERatioScore(decimal? peRatio);
    MetricScore CalculatePBRatioScore(decimal? pbRatio);
    MetricScore CalculateROEScore(decimal? roe);
    MetricScore CalculateProfitMarginScore(decimal? profitMargin);
    
    // Composite scoring
    CompositeScore CalculateCompositeScore(AlphaVantageOverview overview);
    CompositeScore CalculateCompositeScore(decimal? peRatio, decimal? pbRatio, decimal? roe, decimal? profitMargin);
    
    // Recommendations
    string GetRecommendation(CompositeScore score);
    string GetRecommendation(decimal? peRatio, decimal? pbRatio, decimal? roe, decimal? profitMargin);
    
    // Value score operations (with caching)
    Task<ValueScore> CalculateValueScoreAsync(CalculateValueScoreRequest request, CancellationToken cancellationToken = default);
    Task<ValueScore?> GetValueScoreAsync(Guid companyId, CancellationToken cancellationToken = default);
    Task<IEnumerable<ValueScore>> GetTopValueStocksAsync(int count = 10, CancellationToken cancellationToken = default);
    
    // Simple score calculation for other services
    (int peScore, int pbScore, int roeScore, int profitMarginScore, decimal totalScore) CalculateSimpleScore(AlphaVantageOverview overview);
}

public class ScoringService : IScoringService
{
    private readonly ICompanyService _companyService;
    private readonly IAlphaVantageService _alphaVantageService;
    private readonly ConcurrentDictionary<Guid, ValueScore> _cachedScores = new();

    public ScoringService(ICompanyService companyService, IAlphaVantageService alphaVantageService)
    {
        _companyService = companyService;
        _alphaVantageService = alphaVantageService;
    }

    // Individual metric scoring methods
    public MetricScore CalculatePERatioScore(decimal? peRatio)
    {
        if (!peRatio.HasValue || peRatio <= 0)
            return new MetricScore("P/E Ratio", 0, "No earnings or negative P/E", "danger");

        var score = peRatio.Value switch
        {
            < ScoringConstants.PERatio.Excellent => 100,
            < ScoringConstants.PERatio.Good => 85,
            < ScoringConstants.PERatio.Fair => 70,
            < ScoringConstants.PERatio.Expensive => 50,
            _ => 25
        };

        var assessment = peRatio.Value switch
        {
            < ScoringConstants.PERatio.Excellent => "Excellent value (P/E < 10)",
            < ScoringConstants.PERatio.Good => "Good value (P/E < 15)",
            < ScoringConstants.PERatio.Fair => "Fair value (P/E < 20)",
            < ScoringConstants.PERatio.Expensive => "Expensive (P/E < 25)",
            _ => "Very expensive (P/E ≥ 25)"
        };

        return new MetricScore("P/E Ratio", score, assessment, GetColorForScore(score));
    }

    public MetricScore CalculatePBRatioScore(decimal? pbRatio)
    {
        if (!pbRatio.HasValue || pbRatio <= 0)
            return new MetricScore("P/B Ratio", 0, "No book value or negative P/B", "danger");

        var score = pbRatio.Value switch
        {
            < ScoringConstants.PBRatio.Excellent => 100,
            < ScoringConstants.PBRatio.Good => 85,
            < ScoringConstants.PBRatio.Fair => 70,
            < ScoringConstants.PBRatio.Expensive => 50,
            _ => 25
        };

        var assessment = pbRatio.Value switch
        {
            < ScoringConstants.PBRatio.Excellent => "Excellent value (P/B < 1.0)",
            < ScoringConstants.PBRatio.Good => "Good value (P/B < 1.5)",
            < ScoringConstants.PBRatio.Fair => "Fair value (P/B < 2.5)",
            < ScoringConstants.PBRatio.Expensive => "Expensive (P/B < 4.0)",
            _ => "Very expensive (P/B ≥ 4.0)"
        };

        return new MetricScore("P/B Ratio", score, assessment, GetColorForScore(score));
    }

    public MetricScore CalculateROEScore(decimal? roe)
    {
        if (!roe.HasValue)
            return new MetricScore("ROE", 0, "No ROE data available", "danger");

        var roePercentage = roe.Value * 100; // Convert to percentage

        var score = roePercentage switch
        {
            > ScoringConstants.ROE.Excellent => 100,
            > ScoringConstants.ROE.Good => 85,
            > ScoringConstants.ROE.Fair => 70,
            > ScoringConstants.ROE.Poor => 50,
            _ => 25
        };

        var assessment = roePercentage switch
        {
            > ScoringConstants.ROE.Excellent => "Excellent (ROE > 20%)",
            > ScoringConstants.ROE.Good => "Good (ROE > 15%)",
            > ScoringConstants.ROE.Fair => "Fair (ROE > 10%)",
            > ScoringConstants.ROE.Poor => "Poor (ROE > 5%)",
            _ => "Very poor (ROE ≤ 5%)"
        };

        return new MetricScore("ROE", score, assessment, GetColorForScore(score));
    }

    public MetricScore CalculateProfitMarginScore(decimal? profitMargin)
    {
        if (!profitMargin.HasValue)
            return new MetricScore("Profit Margin", 0, "No profit margin data available", "danger");

        var marginPercentage = profitMargin.Value * 100; // Convert to percentage

        var score = marginPercentage switch
        {
            > ScoringConstants.ProfitMargin.Excellent => 100,
            > ScoringConstants.ProfitMargin.Good => 85,
            > ScoringConstants.ProfitMargin.Fair => 70,
            > ScoringConstants.ProfitMargin.Poor => 50,
            _ => 25
        };

        var assessment = marginPercentage switch
        {
            > ScoringConstants.ProfitMargin.Excellent => "Excellent (Profit Margin > 20%)",
            > ScoringConstants.ProfitMargin.Good => "Good (Profit Margin > 15%)",
            > ScoringConstants.ProfitMargin.Fair => "Fair (Profit Margin > 10%)",
            > ScoringConstants.ProfitMargin.Poor => "Poor (Profit Margin > 5%)",
            _ => "Very poor (Profit Margin ≤ 5%)"
        };

        return new MetricScore("Profit Margin", score, assessment, GetColorForScore(score));
    }

    // Composite scoring methods
    public CompositeScore CalculateCompositeScore(AlphaVantageOverview overview)
    {
        return CalculateCompositeScore(overview.PERatio, overview.PriceToBookRatio, overview.ReturnOnEquityTTM, overview.ProfitMargin);
    }

    public CompositeScore CalculateCompositeScore(decimal? peRatio, decimal? pbRatio, decimal? roe, decimal? profitMargin)
    {
        var peScore = CalculatePERatioScore(peRatio);
        var pbScore = CalculatePBRatioScore(pbRatio);
        var roeScore = CalculateROEScore(roe);
        var profitScore = CalculateProfitMarginScore(profitMargin);

        var totalScore = 
            peScore.Score * ScoringConstants.Weights.PERatio +
            pbScore.Score * ScoringConstants.Weights.PBRatio +
            roeScore.Score * ScoringConstants.Weights.ROE +
            profitScore.Score * ScoringConstants.Weights.ProfitMargin;

        return new CompositeScore(totalScore, new[] { peScore, pbScore, roeScore, profitScore });
    }

    // Recommendation methods
    public string GetRecommendation(CompositeScore score)
    {
        return score.TotalScore switch
        {
            >= 80m => "Buy +",
            >= 60m => "Buy",
            >= 40m => "Hold",
            _ => "Avoid"
        };
    }

    public string GetRecommendation(decimal? peRatio, decimal? pbRatio, decimal? roe, decimal? profitMargin)
    {
        var compositeScore = CalculateCompositeScore(peRatio, pbRatio, roe, profitMargin);
        return GetRecommendation(compositeScore);
    }

    // Value score operations (with caching)
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
        var compositeScore = CalculateCompositeScore(overview);
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

    // Simple score calculation for other services
    public (int peScore, int pbScore, int roeScore, int profitMarginScore, decimal totalScore) CalculateSimpleScore(AlphaVantageOverview overview)
    {
        var compositeScore = CalculateCompositeScore(overview);
        
        var peScore = compositeScore.Components.First(c => c.Name == "P/E Ratio").Score;
        var pbScore = compositeScore.Components.First(c => c.Name == "P/B Ratio").Score;
        var roeScore = compositeScore.Components.First(c => c.Name == "ROE").Score;
        var profitMarginScore = compositeScore.Components.First(c => c.Name == "Profit Margin").Score;
        
        return (peScore, pbScore, roeScore, profitMarginScore, compositeScore.TotalScore);
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

    private string GetColorForScore(int score)
    {
        return score switch
        {
            >= 85 => "success",
            >= 70 => "secondary",
            >= 50 => "warning",
            _ => "danger"
        };
    }
}

public record MetricScore(string Name, int Score, string Assessment, string Color);

public record CompositeScore(decimal TotalScore, MetricScore[] Components);
