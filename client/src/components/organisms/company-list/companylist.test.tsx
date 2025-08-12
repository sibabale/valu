import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CompanyList } from './companylist';
import { Company } from '../../../types/company.interface';

const mockCompanies: Company[] = [
  {
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
  },
  {
    id: '2',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    sector: 'Technology',
    industry: 'Hardware',
    marketCap: 3000000000000,
    price: 150.0,
    change: 1.5,
    changePercent: 1.0,
    description: 'Apple Inc. is a technology company.',
    recommendation: 'Buy',
    score: 80,
    ratios: [],
  },
];

describe('CompanyList', () => {
  it('renders company cards correctly', () => {
    const { getByText } = render(<CompanyList companies={mockCompanies} />);

    expect(getByText('Alphabet Inc.')).toBeTruthy();
    expect(getByText('Apple Inc.')).toBeTruthy();
    expect(getByText('GOOGL')).toBeTruthy();
    expect(getByText('AAPL')).toBeTruthy();
  });

  it('handles company press events', () => {
    const onCompanyPress = jest.fn();
    const { getByText } = render(
      <CompanyList companies={mockCompanies} onCompanyPress={onCompanyPress} />
    );

    fireEvent.press(getByText('Alphabet Inc.'));
    expect(onCompanyPress).toHaveBeenCalledWith(mockCompanies[0]);
  });

  it('renders empty state when no companies', () => {
    const { getByText } = render(<CompanyList companies={[]} />);
    expect(getByText('No companies found')).toBeTruthy();
  });
});
