import React from 'react';
import { CompanyOverviewCardProps } from './companyoverviewcard.interface';
import { RecommendationLabel } from '../../atoms/recommendation-label/recommendationlabel';
import {
  CardContainer,
  Header,
  LogoContainer,
  LogoText,
  CompanyName,
  TickerSymbol,
  PriceContainer,
  PriceSection,
  ScoreSection,
  Price,
  MarketCapLabel,
  MarketCapValue,
  Description,
  Divider,
  ScoreContainer,
  ScoreLabel,
  ScoreValue,
} from './companyoverviewcard.styles';

export const CompanyOverviewCard: React.FC<CompanyOverviewCardProps> = ({
  company,
}) => {
  return (
    <CardContainer>
      <Header>
        <LogoContainer color={company.logoColor}>
          <LogoText>{company.logo}</LogoText>
        </LogoContainer>
        <CompanyName>{company.name}</CompanyName>
        <TickerSymbol>{company.ticker}</TickerSymbol>
      </Header>

      <PriceContainer>
        <PriceSection>
          <Price>${company.price.toFixed(2)}</Price>
          <MarketCapLabel>Market Cap: <MarketCapValue>{company.marketCap}</MarketCapValue></MarketCapLabel>
        </PriceSection>
        <ScoreSection>
          <RecommendationLabel recommendation={company.recommendation} />
          <ScoreContainer>
            <ScoreLabel>Score: </ScoreLabel>
            <ScoreValue>{company.score}/100</ScoreValue>
          </ScoreContainer>
        </ScoreSection>
      </PriceContainer>

      <Divider />

      <Description>
        {company.description}
      </Description>
    </CardContainer>
  );
};
