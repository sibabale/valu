import React from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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

export const CompanyDetailsPage: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get company data from route params
  const companyData = (route.params as any)?.company;

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleInfoPress = () => {
    navigation.navigate('ValueScore' as never);
    console.log('Info button pressed');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageContainer>
        <HeaderContainer>
          <BackButton onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </BackButton>
          <Title>VALU</Title>
          <InfoButton onPress={handleInfoPress}>
            <Ionicons name="information-circle" size={24} color="#333333" />
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
                  ticker: companyData.ticker,
                  logo: companyData.name.charAt(0).toUpperCase(),
                  logoColor: "#808080",
                  price: companyData.price,
                  marketCap: companyData.marketCap,
                  recommendation: companyData.recommendation,
                  score: companyData.score,
                  description: companyData.description,
                }}
              />

              <PERatioSection
                peRatio={peRatioMock.peRatio}
                valueScore={peRatioMock.valueScore}
                trend={peRatioMock.trend as 'up' | 'down' | 'neutral'}
                assessment={peRatioMock.assessment}
                description={peRatioMock.description}
              />

              {companyData.financialRatios && companyData.financialRatios.length > 0 && (
                <>
                  <SectionTitle>Additional Financial Ratios</SectionTitle>
                  {companyData.financialRatios.map((ratio: any, index: number) => (
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
            </>
          )}
        </ContentContainer>
      </PageContainer>
    </SafeAreaView>
  );
};
