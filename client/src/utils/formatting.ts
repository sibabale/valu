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