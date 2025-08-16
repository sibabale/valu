export const SCORING_CONSTANTS = {
  PERatio: {
    Excellent: 10,
    Good: 15,
    Fair: 20,
    Expensive: 25,
  },
  PBRatio: {
    Excellent: 1.0,
    Good: 1.5,
    Fair: 2.5,
    Expensive: 4.0,
  },
  ROE: {
    Excellent: 20,
    Good: 15,
    Fair: 10,
    Poor: 5,
  },
  ProfitMargin: {
    Excellent: 20,
    Good: 15,
    Fair: 10,
    Poor: 5,
  },
  Weights: {
    PERatio: 0.30,
    PBRatio: 0.25,
    ROE: 0.25,
    ProfitMargin: 0.20,
  },
} as const;
