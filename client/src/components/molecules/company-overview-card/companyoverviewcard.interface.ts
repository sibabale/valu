export interface CompanyOverviewCardProps {
  company: {
    name: string;
    ticker: string;
    logo: string;
    logoColor: string;
    price: number;
    marketCap: string;
    recommendation: string;
    score: number; // Required, calculated by backend
    description: string;
    ratios?: Array<{
      key: string; // Stable keys: 'pe', 'pb', 'roe', 'profitMargin'
      name: string;
      value: number;
      description: string;
    }>;
  };
  onPress?: () => void;
}
