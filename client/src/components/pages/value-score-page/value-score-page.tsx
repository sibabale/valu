import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
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

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Static metric data for demonstration
  const peRatioRanges: MetricRange[] = [
    {
      min: 0,
      max: 15,
      label: 'Under 15',
      description: 'Great deal! You\'re paying a low price for each dollar of profit',
      score: 100,
      color: 'green',
      isActive: true, // 15.2 falls in this range
    },
    {
      min: 15,
      max: 25,
      label: '15 to 25',
      description: 'Fair price - not too expensive',
      score: 70,
      color: 'yellow',
      isActive: false,
    },
    {
      min: 25,
      max: 35,
      label: '25 to 35',
      description: 'Getting pricey - you\'re paying more for profits',
      score: 40,
      color: 'orange',
      isActive: false,
    },
    {
      min: 35,
      max: undefined,
      label: 'Above 35',
      description: 'Very expensive - high price for the profits you get',
      score: 10,
      color: 'red',
      isActive: false,
    },
    {
      min: undefined,
      max: undefined,
      label: 'Losing money',
      description: 'Company isn\'t making profits right now',
      score: 0,
      color: 'grey',
      isActive: false,
    },
  ];

  const pbRatioRanges: MetricRange[] = [
    {
      min: 0,
      max: 1,
      label: 'Under 1',
      description: 'Trading below book value - potential bargain',
      score: 100,
      color: 'green',
      isActive: false,
    },
    {
      min: 1,
      max: 3,
      label: '1 to 3',
      description: 'Reasonable price relative to book value',
      score: 70,
      color: 'yellow',
      isActive: true, // 1.8 falls in this range
    },
    {
      min: 3,
      max: 5,
      label: '3 to 5',
      description: 'Premium price for book value',
      score: 40,
      color: 'orange',
      isActive: false,
    },
    {
      min: 5,
      max: undefined,
      label: 'Above 5',
      description: 'Very expensive relative to book value',
      score: 10,
      color: 'red',
      isActive: false,
    },
    {
      min: undefined,
      max: undefined,
      label: 'Negative book value',
      description: 'Company has negative book value',
      score: 0,
      color: 'grey',
      isActive: false,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <PageContainer>
        <HeaderContainer>
          <BackButton onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </BackButton>
          <Title>Value Score</Title>
        </HeaderContainer>

        <ContentContainer>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Subtitle>
              Our proprietary scoring system evaluates stocks across multiple
              financial metrics to provide a comprehensive value assessment.
            </Subtitle>

            <MetricBreakdownCard
              title="Price-to-Earnings (P/E) Ratio"
              description="How expensive the stock is compared to its yearly profits."
              currentValue={15.2}
              overallScore={100}
              ranges={peRatioRanges}
            />

            <MetricBreakdownCard
              title="Price-to-Book (P/B) Ratio"
              description="How much you're paying for each dollar of book value."
              currentValue={1.8}
              overallScore={70}
              ranges={pbRatioRanges}
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
