namespace Valu.Api.Services;

public interface IRecommendationService
{
    string CalculateRecommendation(decimal? peRatio, decimal? priceToBookRatio, decimal? returnOnEquity, decimal? profitMargin);
}

public class RecommendationService : IRecommendationService
{

    public string CalculateRecommendation(decimal? peRatio, decimal? priceToBookRatio, decimal? returnOnEquity, decimal? profitMargin)
    {
        var totalScore = 0m;
        var metricsCount = 0;
        var logDetails = new List<string>();
        
        // 1. P/E Ratio (25% weight)
        if (peRatio.HasValue)
        {
            var peScore = peRatio.Value switch
            {
                < 15m => 100m,
                < 25m => 80m,
                < 35m => 50m,
                _ => 20m
            };
            totalScore += peScore * 0.25m;
            metricsCount++;
            logDetails.Add($"P/E {peRatio.Value}: {peScore} pts (25% = {peScore * 0.25m:F1})");
        }
        else { logDetails.Add("P/E: null"); }
        
        // 2. P/B Ratio (25% weight)
        if (priceToBookRatio.HasValue)
        {
            var pbScore = priceToBookRatio.Value switch
            {
                < 1.0m => 100m,
                < 3.0m => 80m,
                < 5.0m => 50m,
                _ => 20m
            };
            totalScore += pbScore * 0.25m;
            metricsCount++;
            logDetails.Add($"P/B {priceToBookRatio.Value}: {pbScore} pts (25% = {pbScore * 0.25m:F1})");
        }
        else { logDetails.Add("P/B: null"); }
        
        // 3. ROE (25% weight)
        if (returnOnEquity.HasValue)
        {
            var roeScore = returnOnEquity.Value switch
            {
                > 0.20m => 100m,
                > 0.15m => 80m,
                > 0.10m => 60m,
                > 0m => 40m,
                _ => 0m
            };
            totalScore += roeScore * 0.25m;
            metricsCount++;
            logDetails.Add($"ROE {returnOnEquity.Value:P1}: {roeScore} pts (25% = {roeScore * 0.25m:F1})");
        }
        else { logDetails.Add("ROE: null"); }
        
        // 4. Profit Margin (25% weight)
        if (profitMargin.HasValue)
        {
            var profitScore = profitMargin.Value switch
            {
                > 0.25m => 100m,
                > 0.15m => 80m,
                > 0.10m => 60m,
                > 0.05m => 40m,
                _ => 20m
            };
            totalScore += profitScore * 0.25m;
            metricsCount++;
            logDetails.Add($"Profit Margin {profitMargin.Value:P1}: {profitScore} pts (25% = {profitScore * 0.25m:F1})");
        }
        else { logDetails.Add("Profit Margin: null"); }
        
        // Calculate final recommendation based on total score
        var recommendation = totalScore switch
        {
            >= 80m => "Buy +",
            >= 60m => "Buy",
            >= 40m => "Hold",
            _ => "Avoid"
        };
        
        Console.WriteLine($"Recommendation calculation: Total Score={totalScore:F1}, Metrics={metricsCount}, Recommendation={recommendation}. Details: {string.Join(", ", logDetails)}");
        
        return recommendation;
    }
} 