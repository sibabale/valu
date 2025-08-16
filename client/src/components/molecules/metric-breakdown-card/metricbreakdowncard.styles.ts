import styled from 'styled-components/native';

const getColorValue = (color: string): string => {
  switch (color) {
    case 'green':
      return '#4CAF50';
    case 'yellow':
      return '#FFC107';
    case 'orange':
      return '#FF9800';
    case 'red':
      return '#F44336';
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
`;

export const TitleSection = styled.View`
  flex: 1;
  margin-right: 12px;
`;

export const Title = styled.Text`
  font-family: 'Space Grotesk-Bold';
  font-size: 18px;
  color: ${theme.colors.text.primary};
  margin-bottom: 4px;
`;

export const Description = styled.Text`
  font-family: 'Space Grotesk-Regular';
  font-size: 14px;
  color: ${theme.colors.text.secondary};
  line-height: 20px;
`;

export const OverallScore = styled.View`
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 8px 12px;
  min-width: 50px;
  align-items: center;
`;

export const OverallScoreText = styled.Text`
  font-family: 'Space Grotesk-Bold';
  font-size: 16px;
  color: ${theme.colors.text.primary};
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

export const ScoreCircle = styled.View<{ color: string; isActive: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border-width: 2px;
  border-color: ${({ color, isActive }) => 
    isActive ? getColorValue(color) : '#cccccc'};
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  position: relative;
`;

export const ScoreText = styled.Text<{ isActive: boolean }>`
  font-family: 'Space Grotesk-Bold';
  font-size: 14px;
  color: ${({ isActive }) =>
    isActive ? theme.colors.text.primary : theme.colors.text.secondary};
`;

export const Checkmark = styled.View<{ color: string }>`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: ${({ color }) => theme.colors[color]};
  justify-content: center;
  align-items: center;
`;

export const RangeContent = styled.View`
  flex: 1;
  margin-right: 12px;
`;

export const RangeLabel = styled.Text<{ isActive: boolean }>`
  font-family: 'Space Grotesk-Bold';
  font-size: 14px;
  color: ${({ isActive }) =>
    isActive ? theme.colors.text.primary : theme.colors.text.secondary};
  margin-bottom: 2px;
`;

export const RangeDescription = styled.Text<{ isActive: boolean }>`
  font-family: 'Space Grotesk-Regular';
  font-size: 12px;
  color: ${({ isActive }) =>
    isActive ? theme.colors.text.primary : theme.colors.text.secondary};
  line-height: 16px;
`;

export const ProgressBar = styled.View<{ color: string; isActive: boolean }>`
  width: 60px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ color, isActive }) =>
    isActive ? theme.colors[color] : theme.colors.grey.light};
`;

export const LoadingContainer = styled.View`
  padding: 40px;
  align-items: center;
`;

export const LoadingText = styled.Text`
  font-family: 'Space Grotesk-Regular';
  font-size: 14px;
  color: ${theme.colors.text.secondary};
  margin-top: 8px;
`;
