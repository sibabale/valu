import styled from 'styled-components/native';

interface LogoContainerProps {
  color: string;
}

interface RecommendationButtonProps {
  color: string;
}

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
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const LogoContainer = styled.View<LogoContainerProps>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${({ color }: LogoContainerProps) => color};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

export const LogoText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
`;

export const CompanyInfo = styled.View`
  flex: 1;
`;

export const CompanyName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 4px;
`;

export const TickerSymbol = styled.Text`
  font-size: 14px;
  color: #666666;
  font-weight: 500;
`;

export const RightSection = styled.View`
  align-items: flex-end;
`;

export const Price = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 8px;
`;

export const RecommendationButton = styled.View<RecommendationButtonProps>`
  background-color: ${({ color }: RecommendationButtonProps) => color};
  padding: 6px 12px;
  border-radius: 6px;
  min-width: 60px;
  align-items: center;
`;

export const RecommendationText = styled.Text<RecommendationButtonProps>`
  color: ${({ color }: RecommendationButtonProps) =>
    color === '#FFC107' ? '#000000' : '#FFFFFF'};
  font-size: 12px;
  font-weight: bold;
  text-align: center;
`;
