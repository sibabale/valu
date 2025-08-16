namespace Valu.Api.Models;

public static class ScoringConstants
{
    // P/E Ratio thresholds (value investing focused)
    public static class PERatio
    {
        public const decimal Excellent = 10m;   // < 10 = 100 points
        public const decimal Good = 15m;        // < 15 = 85 points  
        public const decimal Fair = 20m;        // < 20 = 70 points
        public const decimal Expensive = 25m;   // < 25 = 50 points
        // > 25 = 25 points
    }

    // P/B Ratio thresholds
    public static class PBRatio
    {
        public const decimal Excellent = 1.0m;  // < 1.0 = 100 points
        public const decimal Good = 1.5m;       // < 1.5 = 85 points
        public const decimal Fair = 2.5m;       // < 2.5 = 70 points
        public const decimal Expensive = 4.0m;  // < 4.0 = 50 points
        // > 4.0 = 25 points
    }

    // ROE thresholds (as percentages)
    public static class ROE
    {
        public const decimal Excellent = 20m;   // > 20% = 100 points
        public const decimal Good = 15m;        // > 15% = 85 points
        public const decimal Fair = 10m;        // > 10% = 70 points
        public const decimal Poor = 5m;         // > 5% = 50 points
        // ≤ 5% = 25 points
    }

    // Profit Margin thresholds (as percentages)
    public static class ProfitMargin
    {
        public const decimal Excellent = 20m;   // > 20% = 100 points
        public const decimal Good = 15m;        // > 15% = 85 points
        public const decimal Fair = 10m;        // > 10% = 70 points
        public const decimal Poor = 5m;         // > 5% = 50 points
        // ≤ 5% = 25 points
    }

    // Weights for composite scoring
    public static class Weights
    {
        public const decimal PERatio = 0.30m;
        public const decimal PBRatio = 0.25m;
        public const decimal ROE = 0.25m;
        public const decimal ProfitMargin = 0.20m;
    }
}
