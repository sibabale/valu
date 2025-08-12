export interface CompanyOverviewCardProps {
  company: {
    name: string;
    ticker: string;
    logo: string;
    logoColor: string;
    price: number;
    marketCap: string;
    recommendation: string;
    score?: number; // Made optional since we'll calculate it
    description: string;
    ratios?: Array<{
      name: string;
      value: number;
      description: string;
    }>;
  };
  onPress?: () => void;
}
