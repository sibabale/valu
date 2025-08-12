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
      ticker: 'AAPL',
      recommendation: 'Hold',
      recommendationColor: '#FF9800',
    };

    const { getByText } = render(<CompanyCard company={differentCompany} />);

    expect(getByText('Apple Inc.')).toBeTruthy();
    expect(getByText('AAPL')).toBeTruthy();
    expect(getByText('Hold')).toBeTruthy();
  });
});
