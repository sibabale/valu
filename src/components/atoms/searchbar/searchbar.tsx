import React from 'react';
import { SearchBarProps } from './searchbar.interface';
import { SearchContainer, SearchInput } from './searchbar.styles';

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search',
  ...props
}) => {
  return (
    <SearchContainer>
      <SearchInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        {...props}
      />
    </SearchContainer>
  );
};
