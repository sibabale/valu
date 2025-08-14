export interface Company {
  id: string;
  name: string;
  symbol: string; // Changed from ticker to symbol to match API
  sector: string;
  industry: string;
  marketCap: number;
  price: number;
  change: number;
  changePercent: number;
  description: string;
  recommendation: string;
  score: number;
  ratios: Array<{
    key: string;
    name: string;
    value: number;
    description: string;
  }>;
}

export interface CompanyCardProps {
  company: Company;
  onPress?: () => void;
}

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}
