namespace Valu.Api.Models;

public record ValueScore(
    Guid CompanyId,
    string CompanyName,
    string CompanySymbol,
    decimal Score,
    string Grade,
    List<ScoreComponent> Components,
    DateTime CalculatedAt
);

public record ScoreComponent(
    string Name,
    decimal Weight,
    decimal Score,
    string Description
);

public record CalculateValueScoreRequest(
    Guid CompanyId,
    Dictionary<string, decimal>? CustomWeights = null
); 