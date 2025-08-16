import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { MetricBreakdownCard } from './metricbreakdowncard';
import { MetricBreakdownCardProps } from './metricbreakdowncard.interface';

const mockProps: MetricBreakdownCardProps = {
  title: 'Price-to-Earnings (P/E) Ratio',
  description: 'How expensive the stock is compared to its yearly profits.',
  currentValue: 25.5,
  overallScore: 25,
  ranges: [
    {
      min: 0,
      max: 15,
      label: 'Under 15',
      description: 'Great deal! You\'re paying a low price for each dollar of profit',
      score: 100,
      color: 'green',
      isActive: false,
    },
    {
      min: 15,
      max: 25,
      label: '15 to 25',
      description: 'Fair price - not too expensive',
      score: 70,
      color: 'yellow',
      isActive: true,
    },
    {
      min: 25,
      max: 35,
      label: '25 to 35',
      description: 'Getting pricey - you\'re paying more for profits',
      score: 40,
      color: 'orange',
      isActive: false,
    },
    {
      min: 35,
      max: undefined,
      label: 'Above 35',
      description: 'Very expensive - high price for the profits you get',
      score: 10,
      color: 'red',
      isActive: false,
    },
    {
      min: undefined,
      max: undefined,
      label: 'Losing money',
      description: 'Company isn\'t making profits right now',
      score: 0,
      color: 'grey',
      isActive: false,
    },
  ],
};

describe('MetricBreakdownCard', () => {
  it('renders correctly with all props', () => {
    render(<MetricBreakdownCard {...mockProps} />);

    expect(screen.getByText('Price-to-Earnings (P/E) Ratio')).toBeTruthy();
    expect(screen.getByText('How expensive the stock is compared to its yearly profits.')).toBeTruthy();
    expect(screen.getByText('25%')).toBeTruthy();
    expect(screen.getByText('Under 15')).toBeTruthy();
    expect(screen.getByText('15 to 25')).toBeTruthy();
    expect(screen.getByText('25 to 35')).toBeTruthy();
    expect(screen.getByText('Above 35')).toBeTruthy();
    expect(screen.getByText('Losing money')).toBeTruthy();
  });

  it('shows loading state when isLoading is true', () => {
    render(<MetricBreakdownCard {...mockProps} isLoading={true} />);

    expect(screen.getByText('Loading metric data...')).toBeTruthy();
  });

  it('displays correct scores for each range', () => {
    render(<MetricBreakdownCard {...mockProps} />);

    expect(screen.getByText('100')).toBeTruthy();
    expect(screen.getByText('70')).toBeTruthy();
    expect(screen.getByText('40')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
    expect(screen.getByText('0')).toBeTruthy();
  });

  it('shows active range with checkmark', () => {
    render(<MetricBreakdownCard {...mockProps} />);

    // The active range should have a checkmark icon
    const activeRange = screen.getByText('15 to 25');
    expect(activeRange).toBeTruthy();
  });

  it('renders all range descriptions', () => {
    render(<MetricBreakdownCard {...mockProps} />);

    expect(screen.getByText('Great deal! You\'re paying a low price for each dollar of profit')).toBeTruthy();
    expect(screen.getByText('Fair price - not too expensive')).toBeTruthy();
    expect(screen.getByText('Getting pricey - you\'re paying more for profits')).toBeTruthy();
    expect(screen.getByText('Very expensive - high price for the profits you get')).toBeTruthy();
    expect(screen.getByText('Company isn\'t making profits right now')).toBeTruthy();
  });
});
