import React from 'react';
import { CompanyOverviewCardProps } from './companyoverviewcard.interface';
import { RecommendationLabel } from '../../atoms/recommendation-label/recommendationlabel';
import { calculateOverallScore } from '../../../utils/metricScoring';
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

  // Calculate overall score from ratios if available, otherwise use provided score
  const getOverallScore = (): number => {
    if (company.ratios && company.ratios.length >= 4) {
      const peRatio = company.ratios.find(r => r.name === 'P/E Ratio')?.value || 0;
      const pbRatio = company.ratios.find(r => r.name === 'P/B Ratio')?.value || 0;
      const roe = company.ratios.find(r => r.name === 'ROE')?.value || 0;
      const profitMargin = company.ratios.find(r => r.name === 'Profit Margin')?.value || 0;
      
      return calculateOverallScore(peRatio, pbRatio, roe, profitMargin);
    }
    
    return company.score || 0;
  };

  const overallScore = getOverallScore();

  return (
    <CardContainer>
      <Header>
        <LogoContainer color="#808080">
          <LogoText>{firstLetter}</LogoText>
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
            {overallScore && <ScoreValue>{overallScore}/100</ScoreValue>}
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
