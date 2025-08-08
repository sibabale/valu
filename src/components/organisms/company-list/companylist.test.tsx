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

describe('CompanyList - Public Interface', () => {
  it('displays a list of companies to users', () => {
    const { getByText } = render(<CompanyList companies={mockCompanies} />);

    expect(getByText('Alphabet Inc.')).toBeTruthy();
    expect(getByText('Apple Inc.')).toBeTruthy();
    expect(getByText('GOOGL')).toBeTruthy();
    expect(getByText('AAPL')).toBeTruthy();
  });

  it('allows users to select companies from the list', () => {
    const onCompanyPress = jest.fn();
    const { getByText } = render(
      <CompanyList companies={mockCompanies} onCompanyPress={onCompanyPress} />
    );

    const companyCard = getByText('Alphabet Inc.');
    fireEvent.press(companyCard);
    expect(onCompanyPress).toHaveBeenCalledWith(mockCompanies[0]);
  });

  it('shows helpful message when no companies are available', () => {
    const { getByText } = render(<CompanyList companies={[]} />);
    expect(getByText('No companies found')).toBeTruthy();
  });

  it('allows users to select different companies', () => {
    const onCompanyPress = jest.fn();
    const { getByText } = render(
      <CompanyList companies={mockCompanies} onCompanyPress={onCompanyPress} />
    );

    const appleCard = getByText('Apple Inc.');
    fireEvent.press(appleCard);
    expect(onCompanyPress).toHaveBeenCalledWith(mockCompanies[1]);
  });
});
