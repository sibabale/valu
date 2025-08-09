import styled from 'styled-components/native';
import { theme } from '../../../utils/theme';

export const CardContainer = styled.TouchableOpacity`
  background-color: ${theme.colors.background.secondary};
  border-radius: ${theme.borderRadius.xl}px;
  padding: ${theme.spacing.lg}px;
  margin: ${theme.spacing.sm}px 0;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 3;
`;

export const MainContent = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const LeftSection = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs}px;
  font-family: ${theme.fonts.bold};
`;

export const Description = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text.secondary};
  line-height: 18px;
  font-family: ${theme.fonts.regular};
`;

export const RightSection = styled.View`
  align-items: flex-end;
  justify-content: center;
`;

export const Value = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.xs}px;
  font-family: ${theme.fonts.bold};
`;

interface TrendContainerProps {
  trend: 'up' | 'down' | 'neutral';
}

export const TrendContainer = styled.View<TrendContainerProps>`
  flex-direction: row;
  align-items: center;
`;

export const TrendText = styled.Text<TrendContainerProps>`
  font-size: 12px;
  font-weight: 500;
  color: ${(props: TrendContainerProps) => {
    switch (props.trend) {
      case 'up':
        return '#28a745';
      case 'down':
        return '#dc3545';
      default:
        return '#666666';
    }
  }};
  margin-left: ${theme.spacing.xs}px;
  font-family: ${theme.fonts.medium};
`;

export const ExpandedContent = styled.View`
  margin-top: ${theme.spacing.md}px;
  padding-top: ${theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: #f0f0f0;
`;

export const ExpandedDescription = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text.secondary};
  line-height: 20px;
  font-family: ${theme.fonts.regular};
`;
