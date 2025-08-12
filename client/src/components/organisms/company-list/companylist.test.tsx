import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CompanyList } from './companylist';
import { Company } from '../../../types/company.interface';

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Alphabet Inc.',
    ticker: 'GOOGL',
    logo: 'G',
    price: 150.0,
    recommendation: 'Buy +',
    recommendationColor: '#4CAF50',
    logoColor: '#4285F4',
  },
  {
    id: '2',
    name: 'Apple Inc.',
    ticker: 'AAPL',
    logo: '🍎',
    price: 150.0,
    recommendation: 'Buy',
    recommendationColor: '#FFC107',
    logoColor: '#000000',
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
