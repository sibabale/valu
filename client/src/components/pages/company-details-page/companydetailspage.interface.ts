export interface CompanyDetailsPageProps {
  company: {
    id: string;
    name: string;
    ticker: string;
    price: number;
    marketCap: string;
    recommendation: string;
    score: number;
    description: string;
    logoUrl?: string;
    peRatio: number;
    peRatioTrend: 'up' | 'down' | 'neutral';
    peRatioScore: number;
    peRatioAssessment: string;
    peRatioDescription: string;
    financialRatios: Array<{
      title: string;
      value: string | number;
      trend: 'up' | 'down' | 'neutral';
      description?: string;
    }>;
  };
  onBackPress?: () => void;
  onInfoPress?: () => void;
  onNavigateToValueScore?: () => void;
}
