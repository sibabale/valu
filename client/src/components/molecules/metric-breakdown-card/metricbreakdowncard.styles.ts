import styled from 'styled-components/native';
import { theme } from '../../../utils/theme';

const getColorValue = (color: string): string => {
  switch (color) {
    case 'success':
      return theme.colors.success;
    case 'warning':
      return theme.colors.warning;
    case 'danger':
      return theme.colors.danger;
    case 'secondary':
      return theme.colors.secondary;
    case 'grey':
      return '#cccccc';
    default:
      return '#cccccc';
  }
};

export const Container = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin: 8px 0;
  shadow-color: #000000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  margin-left: -16px;
  margin-right: -16px;
  padding-left: 16px;
  padding-right: 16px;
  padding-bottom: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

export const TitleSection = styled.View`
  flex: 1;
  margin-right: 12px;
`;

export const Title = styled.Text`
  font-family: 'Space Grotesk-Bold';
  font-size: 14px;
  color: #333333;
  margin-bottom: 4px;
  font-weight: 700;

`;

export const Description = styled.Text`
  font-family: 'Space Grotesk-Regular';
  font-size: 14px;
  color: #666666;
  line-height: 20px;
`;

export const RangeItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

export const RangeItemLast = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px 0;
`;

export const ScoreCircle = styled.View<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border-width: 2px;
  border-color: #cccccc;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  position: relative;
`;

export const ScoreText = styled.Text`
  font-family: 'Space Grotesk-Bold';
  font-size: 14px;
  color: #333333;
`;

export const Checkmark = styled.View<{ color: string }>`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: ${({ color }: { color: string }) => getColorValue(color)};
  justify-content: center;
  align-items: center;
`;

export const RangeContent = styled.View`
  flex: 1;
  margin-right: 12px;
`;

export const RangeLabel = styled.Text`
  font-family: 'Space Grotesk-Bold';
  font-size: 14px;
  color: #333333;
  margin-bottom: 2px;
`;

export const RangeDescription = styled.Text`
  font-family: 'Space Grotesk-Regular';
  font-size: 12px;
  color: #666666;
  line-height: 16px;
`;

export const ProgressBar = styled.View<{ color: string; score: number }>`
  width: 60px;
  height: 8px;
  border-radius: 4px;
  background-color: #f0f0f0;
  overflow: hidden;
`;

export const ProgressBarFill = styled.View<{ color: string; score: number }>`
  width: ${({ score }: { score: number }) => score}%;
  height: 100%;
  background-color: ${({ color }: { color: string }) => getColorValue(color)};
  border-radius: 4px;
`;

export const LoadingContainer = styled.View`
  padding: 40px;
  align-items: center;
`;

export const LoadingText = styled.Text`
  font-family: 'Space Grotesk-Regular';
  font-size: 14px;
  color: #666666;
  margin-top: 8px;
`;
