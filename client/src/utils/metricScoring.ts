export const calculatePERatioScore = (peRatio: number): number => {
  if (peRatio < 15) return 100;
  if (peRatio < 25) return 75;
  if (peRatio < 35) return 50;
  return 0;
};

export const calculatePBRatioScore = (pbRatio: number): number => {
  if (pbRatio < 1.5) return 100;
  if (pbRatio < 3) return 75;
  if (pbRatio < 5) return 50;
  return 0;
};

export const calculateROEScore = (roe: number): number => {
  if (roe > 20) return 100;
  if (roe > 15) return 75;
  if (roe > 10) return 50;
  return 0;
};

export const calculateProfitMarginScore = (profitMargin: number): number => {
  if (profitMargin > 15) return 100;
  if (profitMargin > 10) return 75;
  if (profitMargin > 5) return 50;
  return 0;
};

export const calculateOverallScore = (peRatio: number, pbRatio: number, roe: number, profitMargin: number): number => {
  const peScore = calculatePERatioScore(peRatio);
  const pbScore = calculatePBRatioScore(pbRatio);
  const roeScore = calculateROEScore(roe);
  const profitMarginScore = calculateProfitMarginScore(profitMargin);

  // Weighted calculation
  const overallScore = (peScore * 0.3) + (pbScore * 0.25) + (roeScore * 0.25) + (profitMarginScore * 0.2);
  
  return Math.round(overallScore);
};

export const getGrade = (score: number): string => {
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}; 