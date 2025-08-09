export interface CompanyOverviewCardProps {
  company: {
    name: string;
    ticker: string;
    logo: string;
    logoColor: string;
    price: number;
    marketCap: string;
    recommendation: string;
    score: number;
    description: string;
  };
  onPress?: () => void;
}
