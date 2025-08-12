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
  const firstLetter = company.name.charAt(0).toUpperCase();

  return (
    <CardContainer>
      <Header>
        <LogoContainer color="#808080">
          <LogoText>{firstLetter}</LogoText>
        </LogoContainer>
        <CompanyName>{company.name}</CompanyName>
        <TickerSymbol>{company.symbol}</TickerSymbol>
      </Header>

      <PriceContainer>
        <PriceSection>
          <Price>${company.price.toFixed(2)}</Price>
          <MarketCapLabel>
            Market Cap: <MarketCapValue>{company.marketCap}</MarketCapValue>
          </MarketCapLabel>
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

      <Description>{company.description}</Description>
    </CardContainer>
  );
};
