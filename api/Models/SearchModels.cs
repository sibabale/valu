namespace Valu.Api.Models;

public record SearchCompaniesRequest(
    string Query,
    int Page = 1,
    int PageSize = 20
);

public record SearchCompaniesResponse(
    int Page,
    int PageSize,
    int TotalPages,
    int TotalCount,
    List<Company> Companies
);

 