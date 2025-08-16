import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { usePostHog } from 'posthog-react-native';

import {
  PageContainer,
  HeaderContainer,
  BackButton,
  Title,
  ContentContainer,
  SectionTitle,
  BodyText,
  BulletPoint,
  ItalicText,
} from './privacy-policy-page.styles';


const PrivacyPolicyPage: React.FC = () => {
  const navigation = useNavigation();
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      posthog.capture('privacy_policy_viewed', {
        timestamp: new Date().toISOString(),
      });
    }
  }, [posthog]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>
      <PageContainer>
        <HeaderContainer>
          <BackButton onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </BackButton>
          <Title>Privacy Policy</Title>
        </HeaderContainer>

        <ContentContainer>
          <SectionTitle>Financial Disclaimer</SectionTitle>
          <BodyText>
            The information provided in this app is for informational and educational purposes only.
            It should not be considered as financial advice, investment recommendations, or any form
            of professional guidance.
          </BodyText>
          <BodyText>
            All financial data, analysis, and recommendations are based on publicly available
            information and should not be the sole basis for making investment decisions.
          </BodyText>
          <BodyText>
            We strongly recommend that you:
          </BodyText>
          <BulletPoint>• Consult with a qualified financial advisor</BulletPoint>
          <BulletPoint>• Conduct your own research and due diligence</BulletPoint>
          <BulletPoint>• Consider your personal financial situation and risk tolerance</BulletPoint>
          <BulletPoint>• Understand that past performance does not guarantee future results</BulletPoint>

          <SectionTitle>Privacy Policy</SectionTitle>
          <BodyText>
            We respect your privacy and are committed to protecting it. This app does not collect,
            store, or transmit any personal information from users.
          </BodyText>
          <BodyText>
            Information We Collect:
          </BodyText>
          <BulletPoint>• No personal information is collected or stored</BulletPoint>
          <BulletPoint>• Search history is stored locally on your device only</BulletPoint>
          <BulletPoint>• No user accounts or profiles are created</BulletPoint>

          <SectionTitle>Data Usage</SectionTitle>
          <BulletPoint>• The app requires internet access to fetch current financial data</BulletPoint>
          <BulletPoint>• All data displayed is from public financial APIs</BulletPoint>
          <BulletPoint>• No personal information is sent to our servers</BulletPoint>

          <SectionTitle>Risk Warning</SectionTitle>
          <BodyText>
            Investing in stocks and other securities involves risk. You may lose some or all of
            your invested capital. The value of investments can go down as well as up.
          </BodyText>
          <BodyText>
            This app is not responsible for any investment decisions made based on the information
            provided. Users are solely responsible for their investment choices and outcomes.
          </BodyText>

          <ItalicText>
            By using this app, you acknowledge that you have read and understood these disclaimers
            and agree to use the information provided at your own risk.
          </ItalicText>
        </ContentContainer>
      </PageContainer>
    </SafeAreaView>
  );
};

export default PrivacyPolicyPage;