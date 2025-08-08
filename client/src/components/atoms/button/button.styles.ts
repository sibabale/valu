import styled from 'styled-components/native';
import { ButtonProps } from './button.interface';

type ButtonStyleProps = Pick<ButtonProps, 'variant' | 'size'>;

const getVariantColors = (variant: ButtonProps['variant'] = 'primary') => {
  switch (variant) {
    case 'secondary':
      return { bg: '#6c757d', text: '#ffffff' };
    case 'success':
      return { bg: '#28a745', text: '#ffffff' };
    case 'warning':
      return { bg: '#ffc107', text: '#000000' };
    case 'danger':
      return { bg: '#dc3545', text: '#ffffff' };
    default:
      return { bg: '#007aff', text: '#ffffff' };
  }
};

const getSizeStyles = (size: ButtonProps['size'] = 'medium') => {
  switch (size) {
    case 'xx-small':
      return { padding: '4px 8px', fontSize: '10px' };
    case 'x-small':
      return { padding: '6px 12px', fontSize: '12px' };
    case 'small':
      return { padding: '8px 16px', fontSize: '14px' };
    case 'large':
      return { padding: '16px 32px', fontSize: '18px' };
    default:
      return { padding: '12px 24px', fontSize: '16px' };
  }
};

export const ButtonContainer = styled.TouchableOpacity<ButtonStyleProps>`
  background-color: ${({ variant }: ButtonStyleProps) =>
    getVariantColors(variant).bg};
  padding: ${({ size }: ButtonStyleProps) => getSizeStyles(size).padding};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  min-height: 44px;
`;

export const ButtonText = styled.Text<ButtonStyleProps>`
  color: ${({ variant }: ButtonStyleProps) => getVariantColors(variant).text};
  font-size: ${({ size }: ButtonStyleProps) => getSizeStyles(size).fontSize};
  font-weight: bold;
  text-align: center;
`;
