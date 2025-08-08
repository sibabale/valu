import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Header } from './header';

describe('Header', () => {
  it('renders title correctly', () => {
    const { getByText } = render(<Header title="VALU" />);
    expect(getByText('VALU')).toBeTruthy();
  });

  it('handles info button press', () => {
    const onInfoPress = jest.fn();
    const { getByTestId } = render(
      <Header title="VALU" onInfoPress={onInfoPress} />
    );
    
    fireEvent.press(getByTestId('info-button'));
    expect(onInfoPress).toHaveBeenCalledTimes(1);
  });

  it('renders info button when onInfoPress is provided', () => {
    const onInfoPress = jest.fn();
    const { getByTestId } = render(
      <Header title="VALU" onInfoPress={onInfoPress} />
    );
    expect(getByTestId('info-button')).toBeTruthy();
  });
}); 