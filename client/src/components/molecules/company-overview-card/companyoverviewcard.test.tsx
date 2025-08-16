import React from 'react';
import { render } from '@testing-library/react-native';
import { CompanyOverviewCard } from './companyoverviewcard';

describe('CompanyOverviewCard - Public Interface', () => {
  const mockCompany = {
    name: 'Apple Inc.',
    symbol: 'AAPL',
    price: 150.0,
    marketCap: 1780000000000, // $1.78T
    recommendation: 'Hold',
    score: 73,
    description:
      'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    logoUrl: 'https://cdn.brandfetch.io/apple.com/w/400/h/400?c=test',
  };

  it('displays company name to users', () => {
    const { getByText } = render(<CompanyOverviewCard company={mockCompany} />);
    expect(getByText('Apple Inc.')).toBeTruthy();
  });

  it('shows company symbol', () => {
    const { getByText } = render(<CompanyOverviewCard company={mockCompany} />);
    expect(getByText('AAPL')).toBeTruthy();
  });

  it('displays current stock price', () => {
    const { getByText } = render(<CompanyOverviewCard company={mockCompany} />);
    expect(getByText('$150.00')).toBeTruthy();
  });

  it('shows market capitalization', () => {
    const { getByText } = render(<CompanyOverviewCard company={mockCompany} />);
    expect(getByText('Market Cap:')).toBeTruthy();
    expect(getByText('$1.8T')).toBeTruthy();
  });

  it('displays investment recommendation', () => {
    const { getByText } = render(<CompanyOverviewCard company={mockCompany} />);
    expect(getByText('Hold')).toBeTruthy();
  });

  it('shows company score', () => {
    const { getByText } = render(<CompanyOverviewCard company={mockCompany} />);
    expect(getByText('73/100')).toBeTruthy();
  });

  it('displays company description', () => {
    const { getByText } = render(<CompanyOverviewCard company={mockCompany} />);
    expect(
      getByText(
        'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.'
      )
    ).toBeTruthy();
  });

  it('displays different companies correctly', () => {
    const differentCompany = {
      ...mockCompany,
      name: 'Alphabet Inc.',
      symbol: 'GOOGL',
      price: 2750.0,
      marketCap: 1850000000000, // $1.85T
      recommendation: 'Buy',
      score: 85,
      description:
        'Alphabet Inc. provides online advertising services in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.',
      logoUrl: 'https://cdn.brandfetch.io/google.com/w/400/h/400?c=test',
    };

    const { getByText } = render(
      <CompanyOverviewCard company={differentCompany} />
    );

    expect(getByText('Alphabet Inc.')).toBeTruthy();
    expect(getByText('GOOGL')).toBeTruthy();
    expect(getByText('$2750.00')).toBeTruthy();
    expect(getByText('Market Cap:')).toBeTruthy();
    expect(getByText('$1.9T')).toBeTruthy();
    expect(getByText('Buy')).toBeTruthy();
    expect(getByText('85/100')).toBeTruthy();
  });

  it('handles different recommendation types', () => {
    const buyCompany = { ...mockCompany, recommendation: 'Buy' };
    const { getByText } = render(<CompanyOverviewCard company={buyCompany} />);
    expect(getByText('Buy')).toBeTruthy();
  });

  it('hides price when it is zero', () => {
    const zeroPriceCompany = { ...mockCompany, price: 0 };
    const { queryByText, getByText } = render(
      <CompanyOverviewCard company={zeroPriceCompany} />
    );

    expect(queryByText('$0.00')).toBeFalsy();
    expect(getByText('Apple Inc.')).toBeTruthy();
    expect(getByText('AAPL')).toBeTruthy();
    expect(getByText('Market Cap:')).toBeTruthy();
    expect(getByText('$1.8T')).toBeTruthy();
  });
});
