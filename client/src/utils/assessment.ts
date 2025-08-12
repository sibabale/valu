export const getPERatioAssessment = (peRatio: number | null): { assessment: string; color: string } => {
  if (peRatio === null || peRatio <= 0) {
    return { assessment: "No earnings (negative P/E)", color: "danger" };
  }
  
  if (peRatio < 15) {
    return { assessment: "Excellent value (P/E < 15)", color: "success" };
  }
  
  if (peRatio < 25) {
    return { assessment: "Good value (P/E < 25)", color: "secondary" };
  }
  
  if (peRatio < 35) {
    return { assessment: "Fair value (P/E < 35)", color: "warning" };
  }
  
  return { assessment: "Expensive (P/E > 35)", color: "danger" };
};

export const getPBRatioAssessment = (pbRatio: number): { assessment: string; color: string } => {
  if (pbRatio < 1.5) {
    return { assessment: "Excellent value (P/B < 1.5)", color: "success" };
  }
  if (pbRatio < 3) {
    return { assessment: "Good value (P/B < 3)", color: "secondary" };
  }
  if (pbRatio < 5) {
    return { assessment: "Fair value (P/B < 5)", color: "warning" };
  }
  return { assessment: "Expensive (P/B > 5)", color: "danger" };
};

export const getROEAssessment = (roe: number): { assessment: string; color: string } => {
  if (roe > 20) {
    return { assessment: "Excellent (ROE > 20%)", color: "success" };
  }
  if (roe > 15) {
    return { assessment: "Good (ROE > 15%)", color: "secondary" };
  }
  if (roe > 10) {
    return { assessment: "Fair (ROE > 10%)", color: "warning" };
  }
  return { assessment: "Poor (ROE < 10%)", color: "danger" };
};

export const getProfitMarginAssessment = (profitMargin: number): { assessment: string; color: string } => {
  if (profitMargin > 15) {
    return { assessment: "Excellent (Profit Margin > 15%)", color: "success" };
  }
  if (profitMargin > 10) {
    return { assessment: "Good (Profit Margin > 10%)", color: "secondary" };
  }
  if (profitMargin > 5) {
    return { assessment: "Fair (Profit Margin > 5%)", color: "warning" };
  }
  return { assessment: "Poor (Profit Margin < 5%)", color: "danger" };
}; 