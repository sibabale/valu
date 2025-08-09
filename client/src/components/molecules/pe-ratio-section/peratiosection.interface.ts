export interface PERatioSectionProps {
  peRatio: number;
  valueScore: number;
  trend: 'up' | 'down' | 'neutral';
  assessment: string;
  description: string;
  onPress?: () => void;
}
