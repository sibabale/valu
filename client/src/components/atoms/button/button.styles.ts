import styled from 'styled-components/native';
import { ButtonProps } from './button.interface';

const getVariantColors = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'primary':
      return { bg: '#DCFCE7', text: '#008236', border: '#B9F8CF' };
    case 'secondary':
      return { bg: '#FEF9C2', text: '#A65F00', border: '#FFF085' };
    case 'success':
      return { bg: '#DCFCE7', text: '#008236', border: '#B9F8CF' };
    case 'warning':
      return { bg: '#FFEDD4', text: '#CA3500', border: '#FFD7A8' };
    case 'danger':
      return { bg: '#FFE2E2', text: '#C10007', border: '#FFC9C9' };
    default:
      return { bg: '#DCFCE7', text: '#008236', border: '#B9F8CF' };
  }
};

const getSizeStyles = (size: ButtonProps['size']) => {
  switch (size) {
    case 'xx-small':
      return { padding: '4px 8px', fontSize: '10px' };
    case 'x-small':
      return { padding: '8px 16px', fontSize: '12px' };
    case 'small':
      return { padding: '8px 16px', fontSize: '14px' };
    case 'medium':
      return { padding: '12px 24px', fontSize: '16px' };
    case 'large':
      return { padding: '16px 32px', fontSize: '16px' };
    default:
      return { padding: '16px 32px', fontSize: '18px' };
  }
};

export const StyledButton = styled.TouchableOpacity<ButtonProps>`
  background-color: ${({ variant }: ButtonProps) =>
    getVariantColors(variant).bg};
  padding: ${({ size }: ButtonProps) => getSizeStyles(size).padding};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-width: 1px;
  opacity: ${({ disabled }: ButtonProps) => (disabled ? 0.6 : 1)};
  border-color: ${({ variant }: ButtonProps) =>
    getVariantColors(variant).border};
`;

export const ButtonText = styled.Text<ButtonProps>`
  color: ${({ variant }: ButtonProps) => getVariantColors(variant).text};
  font-size: ${({ size }: ButtonProps) => getSizeStyles(size).fontSize};
  font-family: 'Space Grotesk Medium';
  text-align: center;
`;
