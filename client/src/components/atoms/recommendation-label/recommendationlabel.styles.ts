import styled from 'styled-components/native';

type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

interface VariantProps {
  variant: Variant;
}

const getVariantColors = (variant: Variant) => {
  switch (variant) {
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

export const Container = styled.View<VariantProps>`
  background-color: ${({ variant }: VariantProps) => getVariantColors(variant).bg};
  border-radius: 5px;
  padding: 4px 8px;
  align-items: center;
  border-width: 1px;
  border-color: ${({ variant }: VariantProps) => getVariantColors(variant).border};
`;

export const Text = styled.Text<VariantProps>`
  font-size: 12px;
  font-family: 'Space Grotesk Bold';
  color: ${({ variant }: VariantProps) => getVariantColors(variant).text};
`;