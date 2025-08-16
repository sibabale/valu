import { SCORING_CONSTANTS } from './scoringConstants';

export interface MetricScore {
  name: string;
  score: number;
  assessment: string;
  color: string;
}

export const calculatePERatioScore = (peRatio: number | null): MetricScore => {
  if (!peRatio || peRatio <= 0) {
    return {
      name: 'P/E Ratio',
      score: 0,
      assessment: 'No earnings or negative P/E',
      color: 'danger'
    };
  }

  let score: number;
  let assessment: string;

  if (peRatio < SCORING_CONSTANTS.PERatio.Excellent) {
    score = 100;
    assessment = 'Excellent value (P/E < 10)';
  } else if (peRatio < SCORING_CONSTANTS.PERatio.Good) {
    score = 85;
    assessment = 'Good value (P/E < 15)';
  } else if (peRatio < SCORING_CONSTANTS.PERatio.Fair) {
    score = 70;
    assessment = 'Fair value (P/E < 20)';
  } else if (peRatio < SCORING_CONSTANTS.PERatio.Expensive) {
    score = 50;
    assessment = 'Expensive (P/E < 25)';
  } else {
    score = 25;
    assessment = 'Very expensive (P/E ≥ 25)';
  }

  return {
    name: 'P/E Ratio',
    score,
    assessment,
    color: getColorForScore(score)
  };
};

export const calculatePBRatioScore = (pbRatio: number | null): MetricScore => {
  if (!pbRatio || pbRatio <= 0) {
    return {
      name: 'P/B Ratio',
      score: 0,
      assessment: 'No book value or negative P/B',
      color: 'danger'
    };
  }

  let score: number;
  let assessment: string;

  if (pbRatio < SCORING_CONSTANTS.PBRatio.Excellent) {
    score = 100;
    assessment = 'Excellent value (P/B < 1.0)';
  } else if (pbRatio < SCORING_CONSTANTS.PBRatio.Good) {
    score = 85;
    assessment = 'Good value (P/B < 1.5)';
  } else if (pbRatio < SCORING_CONSTANTS.PBRatio.Fair) {
    score = 70;
    assessment = 'Fair value (P/B < 2.5)';
  } else if (pbRatio < SCORING_CONSTANTS.PBRatio.Expensive) {
    score = 50;
    assessment = 'Expensive (P/B < 4.0)';
  } else {
    score = 25;
    assessment = 'Very expensive (P/B ≥ 4.0)';
  }

  return {
    name: 'P/B Ratio',
    score,
    assessment,
    color: getColorForScore(score)
  };
};

export const calculateROEScore = (roe: number | null): MetricScore => {
  if (roe === null) {
    return {
      name: 'ROE',
      score: 0,
      assessment: 'No ROE data available',
      color: 'danger'
    };
  }

  let score: number;
  let assessment: string;

  if (roe > SCORING_CONSTANTS.ROE.Excellent) {
    score = 100;
    assessment = 'Excellent (ROE > 20%)';
  } else if (roe > SCORING_CONSTANTS.ROE.Good) {
    score = 85;
    assessment = 'Good (ROE > 15%)';
  } else if (roe > SCORING_CONSTANTS.ROE.Fair) {
    score = 70;
    assessment = 'Fair (ROE > 10%)';
  } else if (roe > SCORING_CONSTANTS.ROE.Poor) {
    score = 50;
    assessment = 'Poor (ROE > 5%)';
  } else {
    score = 25;
    assessment = 'Very poor (ROE ≤ 5%)';
  }

  return {
    name: 'ROE',
    score,
    assessment,
    color: getColorForScore(score)
  };
};

export const calculateProfitMarginScore = (profitMargin: number | null): MetricScore => {
  if (profitMargin === null) {
    return {
      name: 'Profit Margin',
      score: 0,
      assessment: 'No profit margin data available',
      color: 'danger'
    };
  }

  let score: number;
  let assessment: string;

  if (profitMargin > SCORING_CONSTANTS.ProfitMargin.Excellent) {
    score = 100;
    assessment = 'Excellent (Profit Margin > 20%)';
  } else if (profitMargin > SCORING_CONSTANTS.ProfitMargin.Good) {
    score = 85;
    assessment = 'Good (Profit Margin > 15%)';
  } else if (profitMargin > SCORING_CONSTANTS.ProfitMargin.Fair) {
    score = 70;
    assessment = 'Fair (Profit Margin > 10%)';
  } else if (profitMargin > SCORING_CONSTANTS.ProfitMargin.Poor) {
    score = 50;
    assessment = 'Poor (Profit Margin > 5%)';
  } else {
    score = 25;
    assessment = 'Very poor (Profit Margin ≤ 5%)';
  }

  return {
    name: 'Profit Margin',
    score,
    assessment,
    color: getColorForScore(score)
  };
};

export const calculateCompositeScore = (
  peRatio: number | null,
  pbRatio: number | null,
  roe: number | null,
  profitMargin: number | null
): { totalScore: number; components: MetricScore[] } => {
  const peScore = calculatePERatioScore(peRatio);
  const pbScore = calculatePBRatioScore(pbRatio);
  const roeScore = calculateROEScore(roe);
  const profitScore = calculateProfitMarginScore(profitMargin);

  const totalScore =
    peScore.score * SCORING_CONSTANTS.Weights.PERatio +
    pbScore.score * SCORING_CONSTANTS.Weights.PBRatio +
    roeScore.score * SCORING_CONSTANTS.Weights.ROE +
    profitScore.score * SCORING_CONSTANTS.Weights.ProfitMargin;

  return {
    totalScore: Math.round(totalScore * 100) / 100, // Round to 2 decimal places
    components: [peScore, pbScore, roeScore, profitScore]
  };
};

const getColorForScore = (score: number): string => {
  if (score >= 85) return 'success';
  if (score >= 70) return 'secondary';
  if (score >= 50) return 'warning';
  return 'danger';
};
