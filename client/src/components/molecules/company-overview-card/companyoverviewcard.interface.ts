import { RatioType } from '../../../utils/descriptions';

export interface CompanyOverviewCardProps {
  company: {
    name: string;
    symbol: string; // Changed from ticker to symbol
    price: number;
    marketCap: number;
    recommendation: string;
    score: number; // Required, calculated by backend
    description: string;
    logoUrl?: string;
    ratios?: Array<{
      key: RatioType; // Stable keys: 'pe', 'pb', 'roe', 'profitMargin'
      name: string;
      value: number;
      description: string;
    }>;
  };
  onPress?: () => void;
}
