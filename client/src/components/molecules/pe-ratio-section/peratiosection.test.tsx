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

  it('displays trend information with up indicator', () => {
    const { getByText } = render(<PERatioSection {...defaultProps} />);
    expect(getByText('Up')).toBeTruthy();
  });

  it('displays trend information with down indicator', () => {
    const { getByText } = render(
      <PERatioSection {...defaultProps} trend="down" />
    );
    expect(getByText('Down')).toBeTruthy();
  });

  it('displays trend information with neutral indicator', () => {
    const { getByText } = render(
      <PERatioSection {...defaultProps} trend="neutral" />
    );
    expect(getByText('Neutral')).toBeTruthy();
  });

  it('shows value score label', () => {
    const { getByText } = render(<PERatioSection {...defaultProps} />);
    expect(getByText('Value Score:')).toBeTruthy();
  });

  it('displays value score with progress bar', () => {
    const { getByText } = render(<PERatioSection {...defaultProps} />);
    expect(getByText('70/100')).toBeTruthy();
  });

  it('shows assessment text', () => {
    const { getByText } = render(<PERatioSection {...defaultProps} />);
    expect(getByText('Good value (P/E < 25)')).toBeTruthy();
  });

  it('displays detailed description', () => {
    const { getByText } = render(<PERatioSection {...defaultProps} />);
    expect(
      getByText(
        'Price-to-Earnings ratio measures how much investors are willing to pay per dollar of earnings.'
      )
    ).toBeTruthy();
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
    expect(getByText('85/100')).toBeTruthy();
    expect(getByText('Excellent value (P/E < 15)')).toBeTruthy();
  });

  it('displays different assessments correctly', () => {
    const { getByText } = render(
      <PERatioSection {...defaultProps} assessment="Fair value (P/E 15-25)" />
    );

    expect(getByText('Fair value (P/E 15-25)')).toBeTruthy();
  });
});
