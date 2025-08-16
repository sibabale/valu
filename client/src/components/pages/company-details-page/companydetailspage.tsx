import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePostHog } from 'posthog-react-native';
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
import HelpIcon from '../../atoms/icons/help';
import { CompanyOverviewCard } from '../../molecules/company-overview-card/companyoverviewcard';
import { ValueMetricCard } from '../../molecules/value-metric-card/valuemetriccard';
import { MetricCardWrapper } from '../../molecules/value-metric-card/valuemetriccard.styles';
import { FinancialRatioCard } from '../../molecules/financial-ratio-card/financialratiocard';
import { getRatioDescription } from '../../../utils/descriptions';
import { formatFinancialValue } from '../../../utils/formatting';
import {
  calculatePERatioScore,
  calculatePBRatioScore,
  calculateROEScore,
  calculateProfitMarginScore,
} from '../../../utils/centralizedScoring';

export const CompanyDetailsPage: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const posthog = usePostHog();
  const pageLoadTimeRef = useRef<number>(0);
  // Get company data from route params
  const companyData = (route.params as any)?.company;

  // Track company details view when component mounts
  useEffect(() => {
    if (companyData) {
      // Set page load time for tracking time spent
      pageLoadTimeRef.current = Date.now();

      if (posthog) {
        posthog.capture('company_details_viewed', {
          company_id: companyData.id,
          company_name: companyData.name,
          company_symbol: companyData.symbol,
          recommendation: companyData.recommendation,
          score: companyData.score,
          has_ratios: companyData.ratios && companyData.ratios.length > 0,
          ratios_count: companyData.ratios ? companyData.ratios.length : 0,
          timestamp: new Date().toISOString(),
        });
      }

              // Track individual ratio views
        if (companyData.ratios && posthog) {
          companyData.ratios.forEach((ratio: any) => {
            posthog.capture('financial_ratio_viewed', {
              company_id: companyData.id,
              company_symbol: companyData.symbol,
              ratio_key: ratio.key,
              ratio_name: ratio.name,
              ratio_value: ratio.value,
              timestamp: new Date().toISOString(),
            });
          });
        }
    }
      }, [companyData, posthog]);

  const handleBackPress = () => {
    // Track back navigation
    if (companyData && posthog) {
      posthog.capture('company_details_back_navigation', {
        company_id: companyData.id,
        company_symbol: companyData.symbol,
        time_spent_on_page: Date.now() - pageLoadTimeRef.current || 0,
        timestamp: new Date().toISOString(),
      });
    }
    navigation.goBack();
  };



  const handleInfoPress = () => {
    // Track help button press
    if (companyData && posthog) {
      posthog.capture('help_button_pressed', {
        company_id: companyData.id,
        company_symbol: companyData.symbol,
        timestamp: new Date().toISOString(),
      });
    }
    navigation.navigate('ValueScore' as never);
  };

  const getMetricScore = (metricKey: string, value: number): number => {
    switch (metricKey) {
      case 'pe':
        return calculatePERatioScore(value).score;
      case 'pb':
        return calculatePBRatioScore(value).score;
      case 'roe':
        return calculateROEScore(value).score;
      case 'profitMargin':
        return calculateProfitMarginScore(value).score;
      default:
        return 0;
    }
  };

  const getMetricAssessment = (
    metricName: string,
    value: number
  ): { assessment: string; color: string } => {
    switch (metricName) {
      case 'P/E Ratio': {
        const peScore = calculatePERatioScore(value);
        return { assessment: peScore.assessment, color: peScore.color };
      }
      case 'P/B Ratio': {
        const pbScore = calculatePBRatioScore(value);
        return { assessment: pbScore.assessment, color: pbScore.color };
      }
      case 'ROE': {
        const roeScore = calculateROEScore(value);
        return { assessment: roeScore.assessment, color: roeScore.color };
      }
      case 'Profit Margin': {
        const profitScore = calculateProfitMarginScore(value);
        return { assessment: profitScore.assessment, color: profitScore.color };
      }
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
          <InfoButton onPress={handleInfoPress}>
            <HelpIcon fill="#333333" />
          </InfoButton>
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
                  price: companyData.price,
                  marketCap: companyData.marketCap,
                  recommendation: companyData.recommendation,
                  score: companyData.score,
                  description: companyData.description,
                  logoUrl: companyData.logoUrl,
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
