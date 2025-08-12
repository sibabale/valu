import { RatioType } from '../../../utils/descriptions';

export interface CompanyOverviewCardProps {
  company: {
    name: string;
    symbol: string; // Changed from ticker to symbol
    logo: string;
    logoColor: string;
    price: number;
    marketCap: string;
    recommendation: string;
    score: number; // Required, calculated by backend
    description: string;
    ratios?: Array<{
      key: RatioType; // Stable keys: 'pe', 'pb', 'roe', 'profitMargin'
      name: string;
      value: number;
      description: string;
    }>;
  };
  onPress?: () => void;
}
