import styled from 'styled-components/native';

export const CardContainer = styled.TouchableOpacity`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin: 8px 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

export const LeftSection = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 4px;
`;

export const Description = styled.Text`
  font-size: 12px;
  color: #666666;
  line-height: 16px;
`;

export const RightSection = styled.View`
  align-items: flex-end;
`;

export const Value = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 4px;
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
