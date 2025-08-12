import styled from 'styled-components/native';

export const MetricCardWrapper = styled.View`
  margin-bottom: 20px;
`;

export const CardContainer = styled.View`
  /* Container for the card content */
`;

export const ScoreSection = styled.View`
  margin-bottom: 16px;
`;

export const ScoreLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
`;

export const ProgressContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const ProgressBar = styled.View<{ progress: number }>`
  flex: 1;
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.View<{ progress: number }>`
  height: 100%;
  width: ${(props: { progress: number }) => props.progress}%;
  background-color: ${(props: { progress: number }) => {
    if (props.progress >= 80) return '#4CAF50';
    if (props.progress >= 60) return '#FF9800';
    if (props.progress >= 40) return '#FFC107';
    return '#F44336';
  }};
  border-radius: 4px;
`;

export const ScoreValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  min-width: 50px;
  text-align: right;
`;

export const Assessment = styled.Text<{ color?: string }>`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${(props: { color?: string }) => {
    switch (props.color) {
      case 'success':
        return '#4CAF50';
      case 'secondary':
        return '#2196F3';
      case 'warning':
        return '#FF9800';
      case 'danger':
        return '#F44336';
      default:
        return '#333333';
    }
  }};
`;

export const Description = styled.Text`
  font-size: 14px;
  color: #666666;
  line-height: 20px;
`; 