import styled from 'styled-components/native';

interface ColorProps {
  color: string;
}

export const CardContainer = styled.TouchableOpacity`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  border-width: 1px;
  border-color: #f6f3f4;
  margin: 0 0 8px 0;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

export const LeftSection = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const LogoContainer = styled.View<ColorProps>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ color }: ColorProps) => color};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const LogoText = styled.Text`
  font-size: 18px;
  font-family: 'Space Grotesk Bold';
  color: #ffffff;
`;

export const CompanyInfo = styled.View`
  flex: 1;
`;

export const CompanyName = styled.Text`
  color: #1e2939;
  font-size: 14px;
  font-family: 'Space Grotesk Bold';
  margin-bottom: 4px;
`;

export const TickerSymbol = styled.Text`
  font-size: 14px;
  font-family: 'Space Grotesk';
  color: #6a7282;
`;

export const RightSection = styled.View`
  align-items: flex-end;
`;

export const Price = styled.Text`
  font-size: 14px;
  font-family: 'Space Grotesk Bold';
  color: #1e2939;
  margin-bottom: 8px;
`;

export const RecommendationButton = styled.View<ColorProps>`
  background-color: ${({ color }: ColorProps) => color};
  padding: 6px 12px;
  border-radius: 6px;
  min-width: 60px;
  align-items: center;
`;

export const RecommendationText = styled.Text<ColorProps>`
  font-size: 12px;
  font-family: 'Space Grotesk Medium';
  color: ${({ color }: ColorProps) => (color === '#FFC107' ? '#000000' : '#FFFFFF')};
`;
