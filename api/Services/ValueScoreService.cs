using Valu.Api.Models;
using System.Collections.Concurrent;

namespace Valu.Api.Services;

public class ValueScoreService : IValueScoreService
{
    private readonly ICompanyService _companyService;
    private readonly ConcurrentDictionary<Guid, ValueScore> _cachedScores = new();

    public ValueScoreService(ICompanyService companyService)
    {
        _companyService = companyService;
    }

    public async Task<ValueScore> CalculateValueScoreAsync(CalculateValueScoreRequest request, CancellationToken cancellationToken = default)
    {
        var company = await _companyService.GetByIdAsync(request.CompanyId, cancellationToken);
        if (company == null)
            throw new ArgumentException("Company not found", nameof(request.CompanyId));

        var details = await _companyService.GetDetailsAsync(request.CompanyId, cancellationToken);
        if (details == null)
            throw new ArgumentException("Company details not found", nameof(request.CompanyId));

        // Simple value scoring algorithm
        var components = new List<ScoreComponent>
        {
            CalculatePERatioScore(details),
            CalculatePBRatioScore(details),
            CalculateROEScore(details),
            CalculateProfitMarginScore(details)
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

    private ScoreComponent CalculatePERatioScore(CompanyDetails details)
    {
        var peRatio = details.Ratios.FirstOrDefault(r => r.Name == "P/E Ratio")?.Value ?? 20;
        var score = peRatio < 15m ? 100 : peRatio < 25m ? 75 : peRatio < 35m ? 50 : 25;
        
        return new ScoreComponent("P/E Ratio", 0.3m, score, $"P/E Ratio of {peRatio:F2}");
    }

    private ScoreComponent CalculatePBRatioScore(CompanyDetails details)
    {
        var pbRatio = details.Ratios.FirstOrDefault(r => r.Name == "P/B Ratio")?.Value ?? 3;
        var score = pbRatio < 1.5m ? 100 : pbRatio < 3m ? 75 : pbRatio < 5m ? 50 : 25;
        
        return new ScoreComponent("P/B Ratio", 0.25m, score, $"P/B Ratio of {pbRatio:F2}");
    }

    private ScoreComponent CalculateROEScore(CompanyDetails details)
    {
        var roe = details.Ratios.FirstOrDefault(r => r.Name == "ROE")?.Value ?? 15;
        var score = roe > 20m ? 100 : roe > 15m ? 75 : roe > 10m ? 50 : 25;
        
        return new ScoreComponent("ROE", 0.25m, score, $"ROE of {roe:F1}%");
    }

    private ScoreComponent CalculateProfitMarginScore(CompanyDetails details)
    {
        var profitMargin = details.Ratios.FirstOrDefault(r => r.Name == "Profit Margin")?.Value ?? 0.05m;
        var score = profitMargin > 0.15m ? 100 : profitMargin > 0.10m ? 75 : profitMargin > 0.05m ? 50 : 25;
        
        return new ScoreComponent("Profit Margin", 0.2m, score, $"Profit Margin of {profitMargin:P1}");
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