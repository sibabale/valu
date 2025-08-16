import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { usePostHog } from 'posthog-react-native';
import { Ionicons } from '@expo/vector-icons';
import { MetricBreakdownCard } from '../../molecules/metric-breakdown-card/metricbreakdowncard';
import { MetricRange } from '../../molecules/metric-breakdown-card/metricbreakdowncard.interface';
import {
  PageContainer,
  HeaderContainer,
  BackButton,
  Title,
  ContentContainer,
  Subtitle,
  DisclaimerSection,
  DisclaimerTitle,
  DisclaimerText,
} from './value-score-page.styles';

export const ValueScorePage: React.FC = () => {
  const navigation = useNavigation();
  const posthog = usePostHog();

  // Track value score page view
  useEffect(() => {
    if (posthog) {
      posthog.capture('value_score_page_viewed', {
        timestamp: new Date().toISOString(),
      });
    }
  }, [posthog]);

  // Static metric data for demonstration
  const peRatioRanges: MetricRange[] = [
    {
      min: 0,
      max: 15,
      label: 'Under 15',
      description: 'Great deal! You\'re paying a low price for each dollar of profit',
      score: 100,
      color: 'success',
    },
    {
      min: 15,
      max: 25,
      label: '15 to 25',
      description: 'Fair price - not too expensive',
      score: 70,
      color: 'warning',
    },
    {
      min: 25,
      max: 35,
      label: '25 to 35',
      description: 'Getting pricey - you\'re paying more for profits',
      score: 40,
      color: 'secondary',
    },
    {
      min: 35,
      max: undefined,
      label: 'Above 35',
      description: 'Very expensive - high price for the profits you get',
      score: 10,
      color: 'danger',
    },
    {
      min: undefined,
      max: undefined,
      label: 'Losing money',
      description: 'Company isn\'t making profits right now',
      score: 0,
      color: 'grey',
    },
  ];

  const pbRatioRanges: MetricRange[] = [
    {
      min: 0,
      max: 1,
      label: 'Under 1',
      description: 'Trading below book value - potential bargain',
      score: 100,
      color: 'success',
    },
    {
      min: 1,
      max: 3,
      label: '1 to 3',
      description: 'Reasonable price relative to book value',
      score: 70,
      color: 'warning',
    },
    {
      min: 3,
      max: 5,
      label: '3 to 5',
      description: 'Premium price for book value',
      score: 40,
      color: 'secondary',
    },
    {
      min: 5,
      max: undefined,
      label: 'Above 5',
      description: 'Very expensive relative to book value',
      score: 10,
      color: 'danger',
    },
    {
      min: undefined,
      max: undefined,
      label: 'Negative book value',
      description: 'Company has negative book value',
      score: 0,
      color: 'grey',
    },
  ];

  const roeRanges: MetricRange[] = [
    {
      min: 20,
      max: undefined,
      label: 'Above 20%',
      description: 'Excellent return on equity - very efficient use of capital',
      score: 100,
      color: 'success',
    },
    {
      min: 15,
      max: 20,
      label: '15% to 20%',
      description: 'Good return on equity - efficient capital utilization',
      score: 80,
      color: 'success',
    },
    {
      min: 10,
      max: 15,
      label: '10% to 15%',
      description: 'Moderate return on equity - reasonable performance',
      score: 60,
      color: 'secondary',
    },
    {
      min: 0,
      max: 10,
      label: '0% to 10%',
      description: 'Low return on equity - poor capital efficiency',
      score: 40,
      color: 'warning',
    },
    {
      min: undefined,
      max: 0,
      label: 'Negative ROE',
      description: 'Company is losing money on shareholder investment',
      score: 0,
      color: 'danger',
    },
  ];

  const profitMarginRanges: MetricRange[] = [
    {
      min: 25,
      max: undefined,
      label: 'Above 25%',
      description: 'Excellent profit margin - highly profitable operations',
      score: 100,
      color: 'success',
    },
    {
      min: 15,
      max: 25,
      label: '15% to 25%',
      description: 'Good profit margin - strong profitability',
      score: 80,
      color: 'success',
    },
    {
      min: 10,
      max: 15,
      label: '10% to 15%',
      description: 'Moderate profit margin - reasonable profitability',
      score: 60,
      color: 'secondary',
    },
    {
      min: 5,
      max: 10,
      label: '5% to 10%',
      description: 'Low profit margin - weak profitability',
      score: 40,
      color: 'warning',
    },
    {
      min: 0,
      max: 5,
      label: '0% to 5%',
      description: 'Very low profit margin - poor profitability',
      score: 20,
      color: 'danger',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <PageContainer>
        <HeaderContainer>
          <BackButton onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </BackButton>
          <Title>Value Score</Title>
        </HeaderContainer>

        <ContentContainer>
          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={(event) => {
              const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
              const scrollPercentage = contentOffset.y / (contentSize.height - layoutMeasurement.height);

              // Track when user scrolls to disclaimer section (roughly 80% down)
              if (posthog && scrollPercentage > 0.8) {
                posthog.capture('disclaimer_section_viewed', {
                  scroll_percentage: scrollPercentage,
                  timestamp: new Date().toISOString(),
                });
              }
            }}
            scrollEventThrottle={16}
          >
            <Subtitle>
              Our proprietary scoring system evaluates stocks across multiple
              financial metrics to provide a comprehensive value assessment.
            </Subtitle>

            <MetricBreakdownCard
              title="Price-to-Earnings (P/E) Ratio"
              description="How expensive the stock is compared to its yearly profits."
              currentValue={15.2}
              ranges={peRatioRanges}
            />

            <MetricBreakdownCard
              title="Price-to-Book (P/B) Ratio"
              description="How much you're paying for each dollar of book value."
              currentValue={1.8}
              ranges={pbRatioRanges}
            />

            <MetricBreakdownCard
              title="Return on Equity (ROE)"
              description="How efficiently the company uses shareholder capital to generate profits."
              currentValue={18.5}
              ranges={roeRanges}
            />

            <MetricBreakdownCard
              title="Profit Margin"
              description="How much profit the company makes from each dollar of revenue."
              currentValue={12.5}
              ranges={profitMarginRanges}
            />

            <DisclaimerSection>
              <DisclaimerTitle>Important Disclaimers</DisclaimerTitle>
              <DisclaimerText>
                • Past performance does not guarantee future results
              </DisclaimerText>
              <DisclaimerText>
                • This analysis is for informational purposes only and should
                not be considered as investment advice
              </DisclaimerText>
              <DisclaimerText>
                • Always conduct your own research and consult with a financial
                advisor before making investment decisions
              </DisclaimerText>
              <DisclaimerText>
                • Market conditions can change rapidly, affecting the relevance
                of these metrics
              </DisclaimerText>
            </DisclaimerSection>


          </ScrollView>
        </ContentContainer>
      </PageContainer>
    </SafeAreaView>
  );
};
