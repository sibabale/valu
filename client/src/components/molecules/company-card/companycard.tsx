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
import { Button } from '../../atoms/button/button';

const getRecommendationButton = (recommendation: string) => {
  switch (recommendation) {
    case 'Buy':
      return 'secondary';
    case 'Buy +':
      return 'success';
    case 'Hold':
      return 'warning';
    case 'Avoid':
      return 'danger';
    default:
      return 'primary';
  }
};
export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onPress,
  ...props
}) => {
  return (
    <CardContainer onPress={onPress} activeOpacity={0.8} {...props}>
      <LeftSection>
        <LogoContainer color={company.logoColor}>
          <LogoText>{company.logo}</LogoText>
        </LogoContainer>
        <CompanyInfo>
          <CompanyName>{company.name}</CompanyName>
          <TickerSymbol>{company.ticker}</TickerSymbol>
        </CompanyInfo>
      </LeftSection>

      <RightSection>
        <Price>${company.price.toFixed(2)}</Price>

        <Button
          size="xx-small"
          variant={getRecommendationButton(company.recommendation)}
        >
          {company.recommendation}
        </Button>
      </RightSection>
    </CardContainer>
  );
};
