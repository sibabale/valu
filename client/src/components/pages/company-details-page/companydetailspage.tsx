import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  PageContainer,
  ContentContainer,
  HeaderContainer,
  BackButton,
  Title,
  // InfoButton, // Commented out with info icon
  SectionTitle,
} from './companydetailspage.styles';
import { Ionicons } from '@expo/vector-icons';
import { CompanyOverviewCard } from '../../molecules/company-overview-card/companyoverviewcard';
import { ValueMetricCard } from '../../molecules/value-metric-card/valuemetriccard';
import { MetricCardWrapper } from '../../molecules/value-metric-card/valuemetriccard.styles';
import { FinancialRatioCard } from '../../molecules/financial-ratio-card/financialratiocard';
import {
  getPERatioAssessment,
  getPBRatioAssessment,
  getROEAssessment,
  getProfitMarginAssessment,
} from '../../../utils/assessment';
import { getRatioDescription } from '../../../utils/descriptions';
import { formatFinancialValue } from '../../../utils/formatting';
import {
  calculatePERatioScore,
  calculatePBRatioScore,
  calculateROEScore,
  calculateProfitMarginScore,
} from '../../../utils/metricScoring';

export const CompanyDetailsPage: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Get company data from route params
  const companyData = (route.params as any)?.company;

  const handleBackPress = () => {
    navigation.goBack();
  };

  // const handleInfoPress = () => {
  //   navigation.navigate('ValueScore' as never);
  // };

  const getMetricScore = (metricKey: string, value: number): number => {
    switch (metricKey) {
      case 'pe':
        return calculatePERatioScore(value);
      case 'pb':
        return calculatePBRatioScore(value);
      case 'roe':
        return calculateROEScore(value);
      case 'profitMargin':
        return calculateProfitMarginScore(value);
      default:
        return 0;
    }
  };

  const getMetricAssessment = (
    metricName: string,
    value: number
  ): { assessment: string; color: string } => {
    switch (metricName) {
      case 'P/E Ratio':
        return getPERatioAssessment(value);
      case 'P/B Ratio':
        return getPBRatioAssessment(value);
      case 'ROE':
        return getROEAssessment(value);
      case 'Profit Margin':
        return getProfitMarginAssessment(value);
      default:
        return { assessment: '', color: '' };
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <PageContainer>
        <HeaderContainer>
          <BackButton onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </BackButton>
          <Title>VALU</Title>
          {/* <InfoButton onPress={handleInfoPress}>
            <Ionicons name="information-circle" size={24} color="#333333" />
          </InfoButton> */}
        </HeaderContainer>

        <ContentContainer>
          {!companyData ? (
            <SectionTitle>Loading company details...</SectionTitle>
          ) : (
            <>
              <CompanyOverviewCard
                company={{
                  name: companyData.name,
                  symbol: companyData.symbol,
                  logo: companyData.name.charAt(0).toUpperCase(),
                  logoColor: '#808080',
                  price: companyData.price,
                  marketCap: companyData.marketCap,
                  recommendation: companyData.recommendation,
                  score: companyData.score,
                  description: companyData.description,
                  ratios: companyData.ratios,
                }}
              />

              {companyData.ratios &&
                companyData.ratios.map((ratio: any, index: number) => {
                  const assessmentData = getMetricAssessment(
                    ratio.name,
                    ratio.value
                  );
                  return (
                    <MetricCardWrapper key={index}>
                      <ValueMetricCard
                        title={ratio.name}
                        value={formatFinancialValue(ratio.key, ratio.value)}
                        score={getMetricScore(ratio.key, ratio.value)}
                        assessment={assessmentData.assessment}
                        description={getRatioDescription(ratio.key)}
                        color={assessmentData.color}
                      />
                    </MetricCardWrapper>
                  );
                })}

              {companyData.financialRatios &&
                companyData.financialRatios.length > 0 && (
                  <>
                    <SectionTitle>Additional Financial Ratios</SectionTitle>
                    {companyData.financialRatios.map(
                      (ratio: any, index: number) => (
                        <FinancialRatioCard
                          key={index}
                          title={ratio.title}
                          value={ratio.value}
                          trend={ratio.trend}
                          description={ratio.description}
                        />
                      )
                    )}
                  </>
                )}
            </>
          )}
        </ContentContainer>
      </PageContainer>
    </SafeAreaView>
  );
};
