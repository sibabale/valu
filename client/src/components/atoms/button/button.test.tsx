import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './button';

describe('Button', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(<Button>Test Button</Button>);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('renders with different variants', () => {
    const { getByText } = render(
      <Button variant="success">Success Button</Button>
    );
    expect(getByText('Success Button')).toBeTruthy();
  });

  it('handles press events', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress}>Pressable Button</Button>
    );

    fireEvent.press(getByText('Pressable Button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders disabled state', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button disabled onPress={onPress}>
        Disabled Button
      </Button>
    );

    fireEvent.press(getByText('Disabled Button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
