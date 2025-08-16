import { MetricRange } from '../components/molecules/metric-breakdown-card/metricbreakdowncard.interface';

export const createPERatioRanges = (currentPERatio: number): MetricRange[] => {
  const ranges: MetricRange[] = [
    {
      min: 0,
      max: 15,
      label: 'Under 15',
      description: 'Great deal! You\'re paying a low price for each dollar of profit',
      score: 100,
      color: 'success',
    },
    {
      min: 15,
      max: 25,
      label: '15 to 25',
      description: 'Fair price - not too expensive',
      score: 70,
      color: 'warning',
    },
    {
      min: 25,
      max: 35,
      label: '25 to 35',
      description: 'Getting pricey - you\'re paying more for profits',
      score: 40,
      color: 'secondary',
    },
    {
      min: 35,
      max: undefined,
      label: 'Above 35',
      description: 'Very expensive - high price for the profits you get',
      score: 10,
      color: 'danger',
    },
    {
      min: undefined,
      max: undefined,
      label: 'Losing money',
      description: 'Company isn\'t making profits right now',
      score: 0,
      color: 'grey',
    },
  ];

  return ranges;
};

export const calculatePERatioScore = (currentPERatio: number): number => {
  if (currentPERatio <= 0) return 0;
  if (currentPERatio < 15) return 100;
  if (currentPERatio < 25) return 70;
  if (currentPERatio < 35) return 40;
  return 10;
};

export const createPBRatioRanges = (currentPBRatio: number): MetricRange[] => {
  const ranges: MetricRange[] = [
    {
      min: 0,
      max: 1,
      label: 'Under 1',
      description: 'Trading below book value - potential bargain',
      score: 100,
      color: 'success',
    },
    {
      min: 1,
      max: 3,
      label: '1 to 3',
      description: 'Reasonable price relative to book value',
      score: 70,
      color: 'warning',
    },
    {
      min: 3,
      max: 5,
      label: '3 to 5',
      description: 'Premium price for book value',
      score: 40,
      color: 'secondary',
    },
    {
      min: 5,
      max: undefined,
      label: 'Above 5',
      description: 'Very expensive relative to book value',
      score: 10,
      color: 'danger',
    },
    {
      min: undefined,
      max: undefined,
      label: 'Negative book value',
      description: 'Company has negative book value',
      score: 0,
      color: 'grey',
    },
  ];

  return ranges;
};

export const calculatePBRatioScore = (currentPBRatio: number): number => {
  if (currentPBRatio <= 0) return 0;
  if (currentPBRatio < 1) return 100;
  if (currentPBRatio < 3) return 70;
  if (currentPBRatio < 5) return 40;
  return 10;
};
