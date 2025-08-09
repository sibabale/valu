import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from './searchbar';

describe('SearchBar', () => {
  it('renders correctly with default props', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={onChangeText} />
    );
    expect(getByPlaceholderText('Search')).toBeTruthy();
  });

  it('renders with custom placeholder', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={onChangeText} placeholder="Custom Search" />
    );
    expect(getByPlaceholderText('Custom Search')).toBeTruthy();
  });

  it('handles text input', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChangeText={onChangeText} />
    );
    
    const input = getByPlaceholderText('Search');
    fireEvent.changeText(input, 'test search');
    expect(onChangeText).toHaveBeenCalledWith('test search');
  });

  it('displays the current value', () => {
    const onChangeText = jest.fn();
    const { getByDisplayValue } = render(
      <SearchBar value="current value" onChangeText={onChangeText} />
    );
    expect(getByDisplayValue('current value')).toBeTruthy();
  });
}); 