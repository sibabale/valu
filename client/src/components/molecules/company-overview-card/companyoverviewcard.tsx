import React from 'react';
import { CompanyOverviewCardProps } from './companyoverviewcard.interface';
import {
  CardContainer,
  HeaderSection,
  LogoContainer,
  LogoText,
  CompanyInfo,
  CompanyName,
  TickerSymbol,
  Price,
  MarketCap,
  MetricsSection,
  RecommendationButton,
  RecommendationText,
  ScoreContainer,
  ScoreLabel,
  ScoreValue,
  Description,
} from './companyoverviewcard.styles';

export const CompanyOverviewCard: React.FC<CompanyOverviewCardProps> = ({
  company,
  onPress: _onPress,
}) => {
  return (
    <CardContainer>
      <HeaderSection>
        <LogoContainer color={company.logoColor}>
          <LogoText>{company.logo}</LogoText>
        </LogoContainer>

        <CompanyInfo>
          <CompanyName>{company.name}</CompanyName>
          <TickerSymbol>{company.ticker}</TickerSymbol>
          <Price>${company.price.toFixed(2)}</Price>
          <MarketCap>Market Cap: {company.marketCap}</MarketCap>
        </CompanyInfo>
      </HeaderSection>

      <MetricsSection>
        <RecommendationButton recommendation={company.recommendation}>
          <RecommendationText recommendation={company.recommendation}>
            {company.recommendation}
          </RecommendationText>
        </RecommendationButton>

        <ScoreContainer>
          <ScoreLabel>Score:</ScoreLabel>
          <ScoreValue>{company.score}/100</ScoreValue>
        </ScoreContainer>
      </MetricsSection>

      <Description>{company.description}</Description>
    </CardContainer>
  );
};
