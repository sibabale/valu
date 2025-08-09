export interface FinancialRatioCardProps {
  title: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  description?: string;
  onPress?: () => void;
}
