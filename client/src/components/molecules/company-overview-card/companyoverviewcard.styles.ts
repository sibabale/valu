import styled from 'styled-components/native';

export const CardContainer = styled.View`
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
  align-items: center;
  margin-bottom: 16px;
`;

interface LogoContainerProps {
  color: string;
}

export const LogoContainer = styled.View<LogoContainerProps>`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: ${(props: LogoContainerProps) => props.color};
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

export const LogoText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
`;

export const CompanyInfo = styled.View`
  flex: 1;
`;

export const CompanyName = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 4px;
`;

export const TickerSymbol = styled.Text`
  font-size: 16px;
  color: #666666;
  font-weight: 500;
  margin-bottom: 8px;
`;

export const Price = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 8px;
`;

export const MarketCap = styled.Text`
  font-size: 14px;
  color: #666666;
  margin-bottom: 12px;
`;

export const MetricsSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

interface RecommendationButtonProps {
  recommendation: string;
}

export const RecommendationButton = styled.View<RecommendationButtonProps>`
  background-color: ${(props: RecommendationButtonProps) => {
    switch (props.recommendation) {
      case 'Buy':
        return '#28a745';
      case 'Buy +':
        return '#20c997';
      case 'Hold':
        return '#ffc107';
      case 'Avoid':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  }};
  padding: 8px 16px;
  border-radius: 8px;
  min-width: 80px;
  align-items: center;
`;

export const RecommendationText = styled.Text<RecommendationButtonProps>`
  color: ${(props: RecommendationButtonProps) => {
    switch (props.recommendation) {
      case 'Hold':
        return '#000000';
      default:
        return '#ffffff';
    }
  }};
  font-size: 14px;
  font-weight: bold;
`;

export const ScoreContainer = styled.View`
  align-items: flex-end;
`;

export const ScoreLabel = styled.Text`
  font-size: 12px;
  color: #666666;
  margin-bottom: 4px;
`;

export const ScoreValue = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333333;
`;

export const Description = styled.Text`
  font-size: 14px;
  color: #666666;
  line-height: 20px;
  text-align: justify;
`;
