import React from 'react';
import { render } from '@testing-library/react-native';
import { PERatioSection } from './peratiosection';

describe('PERatioSection - Public Interface', () => {
  const defaultProps = {
    peRatio: 2.4,
    valueScore: 70,
    trend: 'up' as const,
    assessment: 'Good value (P/E < 25)',
    description:
      'Price-to-Earnings ratio measures how much investors are willing to pay per dollar of earnings.',
  };

  it('displays PE ratio title to users', () => {
    const { getByText } = render(<PERatioSection {...defaultProps} />);
    expect(getByText('PE Ratio')).toBeTruthy();
  });

  it('shows the PE ratio value', () => {
    const { getByText } = render(<PERatioSection {...defaultProps} />);
    expect(getByText('2.4')).toBeTruthy();
  });

  it('shows value score label', () => {
    const { getByText } = render(<PERatioSection {...defaultProps} />);
    expect(getByText('Value Score:')).toBeTruthy();
  });

  it('handles different PE ratios correctly', () => {
    const { getByText } = render(
      <PERatioSection
        {...defaultProps}
        peRatio={15.6}
        valueScore={85}
        assessment="Excellent value (P/E < 15)"
      />
    );

    expect(getByText('15.6')).toBeTruthy();
  });
});
