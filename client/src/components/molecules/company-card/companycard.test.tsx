import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CompanyCard } from './companycard';
import { Company } from '../../../types/company.interface';

const mockCompany: Company = {
  id: '1',
  name: 'Alphabet Inc.',
  symbol: 'GOOGL',
  sector: 'Technology',
  industry: 'Software',
  marketCap: 2000000000000,
  price: 150.0,
  change: 2.5,
  changePercent: 1.67,
  description: 'Alphabet Inc. is a technology company.',
  recommendation: 'Buy +',
  score: 75,
  ratios: [],
};

describe('CompanyCard', () => {
  it('renders company information correctly', () => {
    const { getByText } = render(<CompanyCard company={mockCompany} />);

    expect(getByText('Alphabet Inc.')).toBeTruthy();
    expect(getByText('GOOGL')).toBeTruthy();
    expect(getByText('$150.00')).toBeTruthy();
    expect(getByText('Buy +')).toBeTruthy();
  });

  it('handles press events', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <CompanyCard company={mockCompany} onPress={onPress} />
    );

    fireEvent.press(getByText('Alphabet Inc.'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders with different company data', () => {
    const differentCompany: Company = {
      ...mockCompany,
      name: 'Apple Inc.',
      symbol: 'AAPL',
      recommendation: 'Hold',
      score: 60,
    };

    const { getByText } = render(<CompanyCard company={differentCompany} />);

    expect(getByText('Apple Inc.')).toBeTruthy();
    expect(getByText('AAPL')).toBeTruthy();
    expect(getByText('Hold')).toBeTruthy();
  });
});
