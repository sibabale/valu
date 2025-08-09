import React from 'react';
import { CompanyDetailsPageProps } from './companydetailspage.interface';
import {
  PageContainer,
  ContentContainer,
  HeaderContainer,
  BackButton,
  Title,
  InfoButton,
  SectionTitle,
} from './companydetailspage.styles';
import { Ionicons } from '@expo/vector-icons';
import { CompanyOverviewCard } from '../../molecules/company-overview-card/companyoverviewcard';
import { PERatioSection } from '../../molecules/pe-ratio-section/peratiosection';
import { FinancialRatioCard } from '../../molecules/financial-ratio-card/financialratiocard';
import peRatioMock from '../../../data/pe-ratio-mock.json';

export const CompanyDetailsPage: React.FC<CompanyDetailsPageProps> = ({
  company,
  onBackPress,
  onInfoPress,
}) => {
  return (
    <PageContainer>
      <HeaderContainer>
        <BackButton onPress={onBackPress}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </BackButton>
        <Title>VALU</Title>
        <InfoButton onPress={onInfoPress}>
          <Ionicons name="information-circle" size={24} color="#333333" />
        </InfoButton>
      </HeaderContainer>

      <ContentContainer>
        <CompanyOverviewCard
          company={{
            name: company.name,
            ticker: company.ticker,
            logo: company.logo,
            logoColor: company.logoColor,
            price: company.price,
            marketCap: company.marketCap,
            recommendation: company.recommendation,
            score: company.score,
            description: company.description,
          }}
        />

        <PERatioSection
          peRatio={peRatioMock.peRatio}
          valueScore={peRatioMock.valueScore}
          trend={peRatioMock.trend as 'up' | 'down' | 'neutral'}
          assessment={peRatioMock.assessment}
          description={peRatioMock.description}
        />

        {company.financialRatios && company.financialRatios.length > 0 && (
          <>
            <SectionTitle>Additional Financial Ratios</SectionTitle>
            {company.financialRatios.map((ratio, index) => (
              <FinancialRatioCard
                key={index}
                title={ratio.title}
                value={ratio.value}
                trend={ratio.trend}
                description={ratio.description}
              />
            ))}
          </>
        )}
      </ContentContainer>
    </PageContainer>
  );
};
