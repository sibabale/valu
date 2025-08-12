import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  PageContainer,
  HeaderContainer,
  BackButton,
  Title,
  ContentContainer,
  Subtitle,
  ScoreCard,
  ScoreCardTitle,
  ScoreValue,
  ScoreDescription,
  DisclaimerSection,
  DisclaimerTitle,
  DisclaimerText,
} from './value-score-page.styles';

export const ValueScorePage: React.FC = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Hardcoded scoring data based on screenshots
  const scoringData = [
    {
      title: 'P/E Ratio',
      value: '15.2',
      color: '#4CAF50', // Green
      description:
        'A P/E ratio below 20 typically indicates a potentially undervalued stock. This suggests the company may be trading at a reasonable price relative to its earnings.',
      borderColor: '#4CAF50',
    },
    {
      title: 'Price-to-Book (P/B)',
      value: '1.8',
      color: '#FF9800', // Orange
      description:
        'A P/B ratio between 1.0 and 3.0 suggests fair value. This indicates the stock is trading at a reasonable premium to its book value.',
      borderColor: '#FF9800',
    },
    {
      title: 'Debt-to-Equity',
      value: '0.45',
      color: '#4CAF50', // Green
      description:
        'A debt-to-equity ratio below 0.5 indicates low financial risk. This suggests the company has a conservative capital structure.',
      borderColor: '#4CAF50',
    },
    {
      title: 'Return on Equity (ROE)',
      value: '18.5%',
      color: '#F44336', // Red
      description:
        'An ROE above 15% is generally considered good, but this may indicate the company is generating strong returns on shareholder investment.',
      borderColor: '#F44336',
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

            {scoringData.map((item, index) => (
              <ScoreCard
                key={index}
                style={{ borderLeftColor: item.borderColor }}
              >
                <ScoreCardTitle>{item.title}</ScoreCardTitle>
                <ScoreValue color={item.color}>{item.value}</ScoreValue>
                <ScoreDescription>{item.description}</ScoreDescription>
              </ScoreCard>
            ))}

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
