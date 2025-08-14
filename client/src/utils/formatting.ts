export const formatFinancialValue = (key: string, value: number): string => {
  switch (key) {
    case 'pe':
    case 'pb':
      // P/E and P/B ratios display as raw numbers
      return value.toFixed(2);
    case 'roe':
    case 'profitMargin':
      // ROE and Profit Margin display as percentages
      return `${value.toFixed(1)}%`;
    default:
      return value.toString();
  }
};

export const formatMarketCap = (value: number): string => {
  if (value >= 1e12) {
    // Trillions
    return `$${(value / 1e12).toFixed(1)}T`;
  } else if (value >= 1e9) {
    // Billions
    return `$${(value / 1e9).toFixed(1)}B`;
  } else if (value >= 1e6) {
    // Millions
    return `$${(value / 1e6).toFixed(1)}M`;
  } else if (value >= 1e3) {
    // Thousands
    return `$${(value / 1e3).toFixed(1)}K`;
  } else {
    // Less than 1000
    return `$${value.toFixed(0)}`;
  }
};