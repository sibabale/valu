import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from './searchbar';

describe('SearchBar - Public Interface', () => {
  it('provides a search input field for users', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={onChangeText} />
    );
    expect(getByPlaceholderText('Search')).toBeTruthy();
  });

  it('allows users to type custom search terms', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={onChangeText} />
    );

    const searchInput = getByPlaceholderText('Search');
    fireEvent.changeText(searchInput, 'Apple Inc');
    expect(onChangeText).toHaveBeenCalledWith('Apple Inc');
  });

  it('shows users their current search term', () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <SearchBar value="GOOGL" onChangeText={onChangeText} />
    );
    expect(getByDisplayValue('GOOGL')).toBeTruthy();
  });

  it('supports custom placeholder text for different contexts', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar
        value=""
        onChangeText={onChangeText}
        placeholder="Search companies..."
      />
    );
    expect(getByPlaceholderText('Search companies...')).toBeTruthy();
  });
});
