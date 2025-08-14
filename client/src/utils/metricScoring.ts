export const calculatePERatioScore = (peRatio: number): number => {
  if (peRatio < 15) return 100;
  if (peRatio < 25) return 80;
  if (peRatio < 35) return 50;
  return 20;
};

export const calculatePBRatioScore = (pbRatio: number): number => {
  if (pbRatio < 1.0) return 100;
  if (pbRatio < 3.0) return 80;
  if (pbRatio < 5.0) return 50;
  return 20;
};

export const calculateROEScore = (roe: number): number => {
  if (roe > 20) return 100;
  if (roe > 15) return 80;
  if (roe > 10) return 60;
  if (roe > 0) return 40;
  return 0;
};

export const calculateProfitMarginScore = (profitMargin: number): number => {
  if (profitMargin > 25) return 100;
  if (profitMargin > 15) return 80;
  if (profitMargin > 10) return 60;
  if (profitMargin > 5) return 40;
  return 20;
};
