import React from 'react';
import { CompanyOverviewCardProps } from './companyoverviewcard.interface';
import { RecommendationLabel } from '../../atoms/recommendation-label/recommendationlabel';
import { formatMarketCap } from '../../../utils/formatting';
import {
  CardContainer,
  Header,
  LogoContainer,
  LogoText,
  CompanyName,
  MarketCap,
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
          {company.price > 0 && <Price>${company.price.toFixed(2)}</Price>}
          <MarketCap>
          <MarketCapLabel>
            Market Cap:
          </MarketCapLabel>
          <MarketCapValue>{formatMarketCap(company.marketCap)}</MarketCapValue>
        </MarketCap>
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
