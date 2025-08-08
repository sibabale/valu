import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Header } from './header';

describe('Header - Public Interface', () => {
  it('displays the app title to users', () => {
    const { getByText } = render(<Header title="VALU" />);
    expect(getByText('VALU')).toBeTruthy();
  });

  it('allows users to access information/about section', () => {
    const onInfoPress = jest.fn();
    const { getByTestId } = render(
      <Header title="VALU" onInfoPress={onInfoPress} />
    );

    const infoButton = getByTestId('info-button');
    fireEvent.press(infoButton);
    expect(onInfoPress).toHaveBeenCalledTimes(1);
  });

  it('shows info button when available', () => {
    const onInfoPress = jest.fn();
    const { getByTestId } = render(
      <Header title="VALU" onInfoPress={onInfoPress} />
    );
    expect(getByTestId('info-button')).toBeTruthy();
  });

  it('does not show info button when not provided', () => {
    const { queryByTestId } = render(<Header title="VALU" />);
    expect(queryByTestId('info-button')).toBeNull();
  });
});
