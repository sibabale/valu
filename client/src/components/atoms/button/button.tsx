import React from 'react';
import { ButtonProps } from './button.interface';
import { StyledButton, ButtonText } from './button.styles';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled}
      activeOpacity={0.8}
      {...props}
    >
      <ButtonText variant={variant} size={size}>
        {children}
      </ButtonText>
    </StyledButton>
  );
};
