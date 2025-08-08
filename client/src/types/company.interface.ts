export interface Company {
  id: string;
  name: string;
  ticker: string;
  logo: string;
  price: number;
  recommendation: string;
  recommendationColor: string;
  logoColor: string;
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
