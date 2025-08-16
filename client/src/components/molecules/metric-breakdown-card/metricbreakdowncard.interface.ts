export interface MetricRange {
  min?: number;
  max?: number;
  label: string;
  description: string;
  score: number;
  color: 'success' | 'warning' | 'danger' | 'secondary' | 'grey';
}

export interface MetricBreakdownCardProps {
  title: string;
  description: string;
  currentValue: number;
  ranges: MetricRange[];
  isLoading?: boolean;
}
