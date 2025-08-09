import styled from 'styled-components/native';

export const SectionContainer = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 20px;
  margin: 16px 0;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 8px;
  elevation: 5;
`;

export const HeaderSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333333;
`;

export const ValueContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Value = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333333;
  margin-right: 8px;
`;

interface TrendContainerProps {
  trend: 'up' | 'down' | 'neutral';
}

export const TrendContainer = styled.View<TrendContainerProps>`
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  background-color: ${(props: TrendContainerProps) => {
    switch (props.trend) {
      case 'up':
        return '#e8f5e8';
      case 'down':
        return '#ffe8e8';
      default:
        return '#f0f0f0';
    }
  }};
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
  margin-left: 4px;
`;

export const ScoreSection = styled.View`
  margin-bottom: 16px;
`;

export const ScoreLabel = styled.Text`
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
`;

export const ProgressBarContainer = styled.View`
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = styled.View<ProgressBarProps>`
  height: 100%;
  width: ${(props: ProgressBarProps) => props.progress}%;
  background-color: #28a745;
  border-radius: 4px;
`;

export const ScoreValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
`;

export const Assessment = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #ff8c00;
  margin-bottom: 12px;
`;

export const Description = styled.Text`
  font-size: 14px;
  color: #666666;
  line-height: 20px;
  text-align: justify;
`;
