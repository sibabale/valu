import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { HomePage } from './homepage';

describe('HomePage - Public Interface Tests', () => {
  it('renders the main title "VALU"', () => {
    const { getByText } = render(<HomePage />);
    expect(getByText('VALU')).toBeTruthy();
  });

  it('renders search functionality with placeholder', () => {
    const { getByPlaceholderText } = render(<HomePage />);
    expect(getByPlaceholderText('Search')).toBeTruthy();
  });

  it('allows users to search for companies by name', async () => {
    const { getByPlaceholderText, getByText } = render(<HomePage />);
    const searchInput = getByPlaceholderText('Search');
    
    fireEvent.changeText(searchInput, 'Apple');
    
    await waitFor(() => {
      expect(getByText('Apple Inc.')).toBeTruthy();
    });
  });

  it('allows users to search for companies by ticker symbol', async () => {
    const { getByPlaceholderText, getByText } = render(<HomePage />);
    const searchInput = getByPlaceholderText('Search');
    
    fireEvent.changeText(searchInput, 'GOOGL');
    
    await waitFor(() => {
      expect(getByText('Alphabet Inc.')).toBeTruthy();
    });
  });

  it('filters companies when user types in search', async () => {
    const { getByPlaceholderText, queryByText } = render(<HomePage />);
    const searchInput = getByPlaceholderText('Search');
    
    // Initially should show all companies
    expect(queryByText('Alphabet Inc.')).toBeTruthy();
    expect(queryByText('Apple Inc.')).toBeTruthy();
    
    // After search, should only show matching companies
    fireEvent.changeText(searchInput, 'Apple');
    
    await waitFor(() => {
      expect(queryByText('Alphabet Inc.')).toBeFalsy();
      expect(queryByText('Apple Inc.')).toBeTruthy();
    });
  });

  it('shows company cards with essential information', () => {
    const { getByText, getAllByText } = render(<HomePage />);
    
    // Check for company names
    expect(getByText('Alphabet Inc.')).toBeTruthy();
    expect(getByText('Apple Inc.')).toBeTruthy();
    
    // Check for ticker symbols
    expect(getByText('GOOGL')).toBeTruthy();
    expect(getByText('AAPL')).toBeTruthy();
    
    // Check for prices (there are multiple, so use getAllByText)
    expect(getAllByText('$150.00').length).toBeGreaterThan(0);
  });

  it('calls onCompanyPress when user taps a company card', () => {
    const mockOnCompanyPress = jest.fn();
    const { getByText } = render(
      <HomePage onCompanyPress={mockOnCompanyPress} />
    );
    
    fireEvent.press(getByText('Alphabet Inc.'));
    expect(mockOnCompanyPress).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Alphabet Inc.',
        ticker: 'GOOGL'
      })
    );
  });

  it('calls onInfoPress when user taps the info button', () => {
    const mockOnInfoPress = jest.fn();
    const { getByTestId } = render(
      <HomePage onInfoPress={mockOnInfoPress} />
    );
    
    // Use testID for the info button since it's an SVG
    const infoButton = getByTestId('info-button');
    fireEvent.press(infoButton);
    expect(mockOnInfoPress).toHaveBeenCalled();
  });

  it('displays recommendation buttons with correct text', () => {
    const { getByText, getAllByText } = render(<HomePage />);
    
    expect(getByText('Buy +')).toBeTruthy();
    expect(getByText('Buy')).toBeTruthy();
    expect(getByText('Hold')).toBeTruthy();
    // There are multiple "Avoid" buttons, so use getAllByText
    expect(getAllByText('Avoid').length).toBeGreaterThan(0);
  });

  it('handles empty search results gracefully', async () => {
    const { getByPlaceholderText, getByText } = render(<HomePage />);
    const searchInput = getByPlaceholderText('Search');
    
    fireEvent.changeText(searchInput, 'NonExistentCompany');
    
    await waitFor(() => {
      expect(getByText('No companies found')).toBeTruthy();
    });
  });
}); 