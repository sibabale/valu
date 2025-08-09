import React from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CompanyDetailsPage } from '../components/pages/company-details-page/companydetailspage';
import { appleDetails } from '../data/apple-details';

export const CompanyDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get company data from route params, fallback to apple details
  const companyData = (route.params as any)?.company || appleDetails;

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleInfoPress = () => {
    console.log('Info button pressed');
    // Info modal logic would go here
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CompanyDetailsPage
        company={companyData}
        onBackPress={handleBackPress}
        onInfoPress={handleInfoPress}
      />
    </SafeAreaView>
  );
};
