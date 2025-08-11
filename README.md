# Valu - Investment Analysis Platform

A modern investment analysis platform built with React Native (Expo) and ASP.NET Core Minimal APIs.

## 🏗️ Architecture

This is a monorepo containing:

- **`client/`** - React Native mobile app built with Expo
- **`api/`** - ASP.NET Core Minimal API backend

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **.NET 9.0 SDK**
- **Expo CLI** (`npm install -g @expo/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd valu
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client && npm install && cd ..
   ```

3. **Start development servers**
   ```bash
   # Start both client and API
   npm run dev
   
   # Or start them separately:
   npm run dev:client  # React Native app
   npm run dev:api     # .NET API
   ```

## 📱 Client (React Native)

The mobile app is built with:
- **React Native** with Expo
- **TypeScript**
- **Redux Toolkit** for state management
- **Styled Components** for styling
- **React Navigation** for routing

### Features
- Company search and discovery
- Company details with financial metrics
- Value scoring algorithm
- Recent search history
- Modern, intuitive UI

### Running the Client
```bash
cd client
npm start
```

## 🔧 API (.NET Core)

The backend is built with:
- **ASP.NET Core 9.0**
- **Minimal APIs** for lightweight endpoints
- **CORS** configured for React Native
- **Swagger/OpenAPI** documentation

### Features
- Company search and filtering
- Financial data retrieval
- Value scoring calculations
- Health monitoring
- RESTful API design

### API Endpoints

#### Health Check
- `GET /health` - API health status

#### Companies
- `GET /api/companies` - Get all companies
- `GET /api/companies/{id}` - Get company by ID
- `GET /api/companies/{id}/details` - Get detailed company information
- `GET /api/companies/search?query={query}` - Search companies


#### Value Scoring
- `POST /api/value-score/calculate` - Calculate value score
- `GET /api/value-score/{companyId}` - Get value score
- `GET /api/value-score/top?count={count}` - Get top value stocks

### Running the API
```bash
cd api
dotnet run
```

The API will be available at `http://localhost:5000`

## 🧪 Value Scoring Algorithm

The platform uses a sophisticated value scoring system that evaluates companies based on:

1. **P/E Ratio** (30% weight) - Lower is better
2. **P/B Ratio** (25% weight) - Lower is better  
3. **ROE** (25% weight) - Higher is better
4. **Debt-to-Equity** (20% weight) - Lower is better

Scores are graded A-F based on the weighted average.

## 🛠️ Development

### Project Structure
```
valu/
├── client/                 # React Native app
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── store/          # Redux store
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities
│   └── package.json
├── api/                    # .NET API
│   ├── Models/             # Data models
│   ├── Services/           # Business logic
│   └── Program.cs          # Minimal API endpoints
├── package.json            # Root package.json
└── README.md
```

### Available Scripts

```bash
# Development
npm run dev              # Start both client and API
npm run dev:client       # Start React Native app only
npm run dev:api          # Start .NET API only

# Building
npm run build            # Build both client and API
npm run build:client     # Build React Native app
npm run build:api        # Build .NET API

# Testing
npm run test             # Run tests (placeholder)
```

### Adding New Features

1. **API Changes**
   - Add models in `api/Models/`
   - Add services in `api/Services/`
   - Add endpoints in `api/Program.cs`

2. **Client Changes**
   - Add components in `client/src/components/`
   - Update Redux store in `client/src/store/`
   - Add types in `client/src/types/`

## 🔒 Environment Configuration

### API Configuration
The API uses `appsettings.json` for configuration. For development, create `appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### Client Configuration
The React Native app uses environment variables. Create a `.env` file in the `client/` directory if needed.

## 🚀 Deployment

### API Deployment
The .NET API can be deployed to:
- Azure App Service
- AWS Lambda
- Docker containers
- Any .NET Core hosting platform

### Client Deployment
The React Native app can be deployed via:
- Expo Application Services (EAS)
- App Store / Google Play Store
- Internal distribution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub 