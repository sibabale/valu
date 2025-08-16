import styled from 'styled-components/native';
import { theme } from '../../../utils/theme';

export const PageContainer = styled.View`
  flex: 1;
  background-color: ${theme.colors.background.primary};
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${theme.spacing.md}px ${theme.spacing.lg}px;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
`;

export const BackButton = styled.TouchableOpacity`
  padding: ${theme.spacing.sm}px;
  margin-right: ${theme.spacing.md}px;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text.primary};
  font-family: ${theme.fonts.bold};
  flex: 1;
  text-align: center;
  margin-right: ${theme.spacing.md}px;
`;

export const ContentContainer = styled.View`
  flex: 1;
  padding: ${theme.spacing.lg}px;
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text.secondary};
  font-family: ${theme.fonts.regular};
  margin-bottom: ${theme.spacing.lg}px;
  text-align: center;
  line-height: 22px;
`;

export const ScoreCard = styled.View`
  background-color: #f8f9fa;
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.md}px;
  border-left-width: 4px;
`;

export const ScoreCardTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text.primary};
  font-family: ${theme.fonts.bold};
  margin-bottom: ${theme.spacing.sm}px;
`;

export const ScoreValue = styled.Text<{ color: string }>`
  font-size: 16px;
  font-weight: bold;
  color: ${(props: { color: string }) => props.color};
  font-family: ${theme.fonts.bold};
  margin-bottom: ${theme.spacing.sm}px;
`;

export const ScoreDescription = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text.secondary};
  font-family: ${theme.fonts.regular};
  line-height: 20px;
`;

export const DisclaimerSection = styled.View`
  margin-top: ${theme.spacing.lg}px;
  padding-top: ${theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: #e0e0e0;
`;

export const DisclaimerTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${theme.colors.text.primary};
  font-family: ${theme.fonts.bold};
  margin-bottom: ${theme.spacing.sm}px;
`;

export const DisclaimerText = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text.secondary};
  font-family: ${theme.fonts.regular};
  line-height: 20px;
  margin-bottom: ${theme.spacing.sm}px;
`;
