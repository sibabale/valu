import styled from 'styled-components/native';
import { theme } from '../../../utils/theme';

export const ScoreSection = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg}px;
`;

export const ScoreLabel = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text.secondary};
  font-family: ${theme.fonts.regular};
`;

export const ProgressContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;


interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = styled.View<ProgressBarProps>`
  width: 60px;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.View<ProgressBarProps>`
  width: ${(props: ProgressBarProps) => props.progress}%;
  height: 100%;
  background-color: ${theme.colors.primary};
  border-radius: 4px;
`;

export const ScoreValue = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${theme.colors.text.primary};
  font-family: ${theme.fonts.bold};
`;

export const Assessment = styled.Text`
  font-size: 14px;
  color: #ff8c00;
  font-weight: 500;
  margin-bottom: ${theme.spacing.md}px;
  font-family: ${theme.fonts.medium};
`;

export const Description = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text.secondary};
  line-height: 20px;
  font-family: ${theme.fonts.regular};
`;
