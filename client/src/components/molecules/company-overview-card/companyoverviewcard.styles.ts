import styled from 'styled-components/native';

export const CardContainer = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  border-width: 1px;
  border-color: #f0f0f0;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.08;
  shadow-radius: 12px;
  elevation: 4;
  width: 100%;
  margin-bottom: 16px;
`;

export const Header = styled.View`
  align-items: flex-start;
  margin-bottom: 16px;
`;

interface LogoContainerProps {
  color: string;
}

export const LogoContainer = styled.View<LogoContainerProps>`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background-color: ${({ color }: LogoContainerProps) => color};
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

export const LogoText = styled.Text`
  font-size: 24px;
`;

export const CompanyName = styled.Text`
  font-size: 18px;
  font-family: 'Space Grotesk Bold';
  color: #1a1a1a;
  margin-bottom: 4px;
`;

export const TickerSymbol = styled.Text`
  font-size: 14px;
  font-family: 'Space Grotesk';
  color: #666666;
`;

export const PriceContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const PriceSection = styled.View`
  flex-direction: column;
  align-items: flex-start;
`;

export const ScoreSection = styled.View`
  flex-direction: column;
  align-items: flex-end;
`;

export const Price = styled.Text`
  font-size: 32px;
  font-family: 'Space Grotesk Bold';
  color: #1a1a1a;
`;

export const RecommendationContainer = styled.View`
  background-color: #FFF3CD;
  border-radius: 16px;
  padding: 6px 12px;
  align-items: center;
`;

export const RecommendationLabel = styled.Text`
  font-size: 12px;
  font-family: 'Space Grotesk Bold';
  color: #856404;
`;

export const RecommendationValue = styled.Text`
  font-size: 12px;
  font-family: 'Space Grotesk Bold';
  color: #856404;
`;

export const ScoreContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

export const ScoreLabel = styled.Text`
  font-size: 12px;
  font-family: 'Space Grotesk';
  color: #666666;
  margin-right: 4px;
`;

export const ScoreValue = styled.Text`
  font-size: 12px;
  font-family: 'Space Grotesk Bold';
  color: #1a1a1a;
`;

export const MarketCapLabel = styled.Text`
  font-size: 12px;
  font-family: 'Space Grotesk';
  color: #666666;
  margin-bottom: 4px;
`;

export const MarketCapValue = styled.Text`
  font-size: 14px;
  font-family: 'Space Grotesk Medium';
  color: #1a1a1a;
  margin-bottom: 16px;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: #F6F3F4;
  width: 100%;
  margin: 8px 0;
`;

export const Description = styled.Text`
  font-size: 13px;
  font-family: 'Space Grotesk';
  color: #4a4a4a;
  line-height: 18px;
  text-align: left;
`;
