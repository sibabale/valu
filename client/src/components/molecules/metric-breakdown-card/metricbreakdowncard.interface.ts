export interface MetricRange {
  min?: number;
  max?: number;
  label: string;
  description: string;
  score: number;
  color: 'green' | 'yellow' | 'orange' | 'red' | 'grey';
  isActive: boolean;
}

export interface MetricBreakdownCardProps {
  title: string;
  description: string;
  currentValue: number;
  overallScore: number;
  ranges: MetricRange[];
  isLoading?: boolean;
}
