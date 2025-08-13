export type RatioType = 'pe' | 'pb' | 'roe' | 'profitMargin';

export const getRatioDescription = (ratioType: RatioType): string => {
  switch (ratioType) {
    case 'pe':
      return 'Price-to-Earnings ratio measures how much investors are willing to pay per dollar of earnings. In value investing, lower P/E ratios (typically under 15-25) are preferred as they indicate the stock may be undervalued relative to its earnings potential.';

    case 'pb':
      return "Price-to-Book ratio compares a company's market value to its book value. In value investing, lower P/B ratios (typically under 1.5-3) are preferred as they suggest the stock is trading close to or below its book value, potentially indicating undervaluation.";

    case 'roe':
      return "Return on Equity measures how efficiently a company generates profits from shareholders' equity. In value investing, higher ROE (typically above 15-20%) is preferred as it indicates the company is effectively using capital to generate returns for shareholders.";

    case 'profitMargin':
      return 'Profit Margin measures how much profit a company generates from its revenue. In value investing, higher profit margins (typically above 10-15%) are preferred as they indicate strong operational efficiency and pricing power, suggesting sustainable competitive advantages.';

    default: {
      const exhaustiveCheck: never = ratioType;
      throw new Error(`Unhandled ratio type: ${exhaustiveCheck}`);
    }
  }
};
