import React from 'react';
import { CompanyCardProps } from './companycard.interface';
import {
  CardContainer,
  LeftSection,
  LogoContainer,
  LogoText,
  CompanyInfo,
  CompanyName,
  TickerSymbol,
  RightSection,
  Price,
} from './companycard.styles';
import { RecommendationLabel } from '../../atoms/recommendation-label/recommendationlabel';

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onPress,
  ...props
}) => {
  const firstLetter = company.name.charAt(0).toUpperCase();

  return (
    <CardContainer onPress={onPress} activeOpacity={0.8} {...props}>
      <LeftSection>
        <LogoContainer color="#808080">
          <LogoText>{firstLetter}</LogoText>
        </LogoContainer>
        <CompanyInfo>
          <CompanyName>{company.name}</CompanyName>
          <TickerSymbol>{company.ticker}</TickerSymbol>
        </CompanyInfo>
      </LeftSection>

      <RightSection>
        <Price>${company.price.toFixed(2)}</Price>

        <RecommendationLabel recommendation={company.recommendation} />
      </RightSection>
    </CardContainer>
  );
};
