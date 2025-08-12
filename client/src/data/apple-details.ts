export const appleDetails = {
  id: "1",
  name: "Apple Inc.",
  ticker: "AAPL",
  price: 150.0,
  marketCap: "$1780.0B",
  recommendation: "Hold",
  score: 73,
  description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company serves consumers, small and mid-sized businesses, education, enterprise, and government customers.",
  peRatio: 2.4,
  peRatioTrend: "up" as const,
  peRatioScore: 70,
  peRatioAssessment: "Good value (P/E < 25)",
  peRatioDescription: "Price-to-Earnings ratio measures how much investors are willing to pay per dollar of earnings. Lower values generally indicate better value, but this varies by industry. A P/E ratio under 15 is often considered attractive for value investors.",
  financialRatios: [
    {
      title: "PE Ratio",
      value: "2.4",
      trend: "down" as const,
      description: "Price-to-Earnings ratio"
    },
    {
      title: "Price-to-Book (P/B)",
      value: "2.4",
      trend: "down" as const,
      description: "Price-to-Book ratio"
    },
    {
      title: "Debt-to-Equity",
      value: "2.4",
      trend: "down" as const,
      description: "Debt-to-Equity ratio"
    },
    {
      title: "Return on Equity (ROE)",
      value: "2.4",
      trend: "down" as const,
      description: "Return on Equity percentage"
    }
  ]
}; 