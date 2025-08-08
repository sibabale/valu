import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CompanyCard } from './companycard';
import { Company } from '../../../types/company.interface';

const mockCompany: Company = {
  id: '1',
  name: 'Alphabet Inc.',
  ticker: 'GOOGL',
  logo: 'G',
  price: 150.0,
  recommendation: 'Buy +',
  recommendationColor: '#4CAF50',
  logoColor: '#4285F4',
};

describe('CompanyCard - Public Interface', () => {
  it('displays company name to users', () => {
    const { getByText } = render(<CompanyCard company={mockCompany} />);
    expect(getByText('Alphabet Inc.')).toBeTruthy();
  });

  it('shows company ticker symbol', () => {
    const { getByText } = render(<CompanyCard company={mockCompany} />);
    expect(getByText('GOOGL')).toBeTruthy();
  });

  it('displays current stock price', () => {
    const { getByText } = render(<CompanyCard company={mockCompany} />);
    expect(getByText('$150.00')).toBeTruthy();
  });

  it('shows investment recommendation', () => {
    const { getByText } = render(<CompanyCard company={mockCompany} />);
    expect(getByText('Buy +')).toBeTruthy();
  });

  it('allows users to select a company', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <CompanyCard company={mockCompany} onPress={onPress} />
    );

    const companyCard = getByText('Alphabet Inc.');
    fireEvent.press(companyCard);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('displays different companies correctly', () => {
    const differentCompany: Company = {
      ...mockCompany,
      name: 'Apple Inc.',
      ticker: 'AAPL',
      price: 175.5,
      recommendation: 'Hold',
      recommendationColor: '#FF9800',
    };

    const { getByText } = render(<CompanyCard company={differentCompany} />);

    expect(getByText('Apple Inc.')).toBeTruthy();
    expect(getByText('AAPL')).toBeTruthy();
    expect(getByText('$175.50')).toBeTruthy();
    expect(getByText('Hold')).toBeTruthy();
  });
});
