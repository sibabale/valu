# Valu API

A Minimal API for the Valu investment analysis application, built with ASP.NET Core.

## Features

- **Company Search**: Search companies by name, symbol, or sector
- **Company Details**: Get detailed financial information for companies
- **Value Scoring**: Calculate value scores based on financial ratios
- **Popular Stocks**: Get list of popular stocks
- **Health Check**: API health monitoring endpoint

## Getting Started

### Prerequisites

- .NET 9.0 SDK
- Visual Studio 2022 or VS Code

### Running the API

1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Run the application:
   ```bash
   dotnet run
   ```

3. The API will be available at:
   - **API**: http://localhost:5000
   - **Swagger**: http://localhost:5000/swagger (in development)

## API Endpoints

### Health Check
- `GET /health` - Check API health status

### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/{id}` - Get company by ID
- `GET /api/companies/{id}/details` - Get detailed company information
- `GET /api/companies/search?query={query}&page={page}&pageSize={pageSize}` - Search companies
- `GET /api/companies/popular` - Get popular stocks

### Value Scoring
- `POST /api/value-score/calculate` - Calculate value score for a company
- `GET /api/value-score/{companyId}` - Get value score for a company
- `GET /api/value-score/top?count={count}` - Get top value stocks

## Example Requests

### Search Companies
```bash
curl "http://localhost:5000/api/companies/search?query=Apple&page=1&pageSize=10"
```

### Calculate Value Score
```bash
curl -X POST "http://localhost:5000/api/value-score/calculate" \
  -H "Content-Type: application/json" \
  -d '{"companyId": "12345678-1234-1234-1234-123456789012"}'
```

### Get Company Details
```bash
curl "http://localhost:5000/api/companies/12345678-1234-1234-1234-123456789012/details"
```

## Value Scoring Algorithm

The value scoring system evaluates companies based on:

1. **P/E Ratio** (30% weight) - Lower is better
2. **P/B Ratio** (25% weight) - Lower is better  
3. **ROE** (25% weight) - Higher is better
4. **Debt-to-Equity** (20% weight) - Lower is better

Scores are graded A-F based on the weighted average.

## CORS Configuration

The API is configured to allow requests from:
- `http://localhost:19006` (Expo development server)
- `http://localhost:19000` (Expo alternative port)

## Project Structure

```
api/
├── Models/              # Data models and DTOs
│   ├── Company.cs
│   ├── ValueScore.cs
│   └── SearchModels.cs
├── Services/            # Business logic services
│   ├── ICompanyService.cs
│   ├── CompanyService.cs
│   ├── IValueScoreService.cs
│   └── ValueScoreService.cs
├── Program.cs           # Minimal API endpoints
└── README.md
```

## Development

### Adding New Endpoints

1. Add the endpoint to `Program.cs`
2. Create any necessary models in `Models/`
3. Add business logic to services in `Services/`

### Testing

```bash
dotnet test
```

### Building

```bash
dotnet build
```

## Future Enhancements

- Database integration with Entity Framework Core
- Real-time stock data integration
- Authentication and authorization
- Rate limiting
- Caching layer
- More sophisticated value scoring algorithms 