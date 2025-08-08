import React from 'react';
import { ButtonProps } from './button.interface';
import { ButtonContainer, ButtonText } from './button.styles';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  ...props
}) => {
  return (
    <ButtonContainer variant={variant} size={size} {...props}>
      <ButtonText variant={variant} size={size}>
        {children}
      </ButtonText>
    </ButtonContainer>
  );
};
