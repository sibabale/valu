import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FinancialRatioCard } from './financialratiocard';

describe('FinancialRatioCard - Public Interface', () => {
  const defaultProps = {
    title: 'PE Ratio',
    value: '2.4',
    trend: 'up' as const,
    description: 'Price-to-Earnings ratio',
  };

  it('displays the financial ratio title to users', () => {
    const { getByText } = render(<FinancialRatioCard {...defaultProps} />);
    expect(getByText('PE Ratio')).toBeTruthy();
  });

  it('shows the financial ratio value', () => {
    const { getByText } = render(<FinancialRatioCard {...defaultProps} />);
    expect(getByText('2.4')).toBeTruthy();
  });

  it('displays trend information with up indicator', () => {
    const { getByText } = render(<FinancialRatioCard {...defaultProps} />);
    expect(getByText('Up')).toBeTruthy();
  });

  it('displays trend information with down indicator', () => {
    const { getByText } = render(
      <FinancialRatioCard {...defaultProps} trend="down" />
    );
    expect(getByText('Down')).toBeTruthy();
  });

  it('displays trend information with neutral indicator', () => {
    const { getByText } = render(
      <FinancialRatioCard {...defaultProps} trend="neutral" />
    );
    expect(getByText('Neutral')).toBeTruthy();
  });

  it('shows optional description when provided', () => {
    const { getByText } = render(<FinancialRatioCard {...defaultProps} />);
    expect(getByText('Price-to-Earnings ratio')).toBeTruthy();
  });

  it('allows users to interact with the card', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <FinancialRatioCard {...defaultProps} onPress={onPress} />
    );

    const card = getByText('PE Ratio');
    fireEvent.press(card);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('displays different financial ratios correctly', () => {
    const { getByText } = render(
      <FinancialRatioCard
        title="Price-to-Book (P/B)"
        value="1.8"
        trend="down"
        description="Price-to-Book ratio"
      />
    );

    expect(getByText('Price-to-Book (P/B)')).toBeTruthy();
    expect(getByText('1.8')).toBeTruthy();
    expect(getByText('Down')).toBeTruthy();
    expect(getByText('Price-to-Book ratio')).toBeTruthy();
  });

  it('handles numeric values correctly', () => {
    const { getByText } = render(
      <FinancialRatioCard title="ROE" value={15.6} trend="up" />
    );

    expect(getByText('ROE')).toBeTruthy();
    expect(getByText('15.6')).toBeTruthy();
  });
});
