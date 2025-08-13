namespace Valu.Api.Models;

public record Company(
    Guid Id,
    string Name,
    string Symbol,
    string Sector,
    string Industry,
    decimal MarketCap,
    decimal Price,
    decimal Change,
    decimal ChangePercent,
    string Description,
    string Recommendation,
    decimal Score,
    List<FinancialRatio> Ratios
);

public record CompanyDetails(
    Guid Id,
    string Name,
    string Symbol,
    string Sector,
    string Industry,
    decimal MarketCap,
    decimal Price,
    decimal Change,
    decimal ChangePercent,
    string Description,
    decimal Score,
    FinancialMetrics Financials,
    List<FinancialRatio> Ratios
);

public record FinancialMetrics(
    decimal Cash,
    decimal Debt,
    decimal Revenue,
    decimal NetIncome,
    decimal TotalAssets,
    decimal TotalLiabilities
);

public record FinancialRatio(
    string Key,
    string Name,
    decimal Value,
    string Description
); 