export const getPERatioAssessment = (peRatio: number | null): string => {
  console.log('peRatio', peRatio);
  if (peRatio === null || peRatio <= 0) {
    return "No earnings (negative P/E)";
  }
  
  if (peRatio < 15) {
    return "Excellent value (P/E < 15)";
  }
  
  if (peRatio < 25) {
    return "Good value (P/E < 25)";
  }
  
  if (peRatio < 35) {
    return "Fair value (P/E < 35)";
  }
  
  return "Expensive (P/E > 35)";
}; 