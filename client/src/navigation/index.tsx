import React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PostHogProvider } from 'posthog-react-native';
import { POSTHOG_CONFIG } from '../utils/config';

// Import pages directly
import {
  HomePage,
  ValueScorePage,
  CompanyDetailsPage,
  PrivacyPolicyPage,
} from '../components/pages';

const Stack = createStackNavigator();

  const AppNavigator = () => {
  const navigationRef = useNavigationContainerRef();
  return (
    <NavigationContainer ref={navigationRef}>
      <PostHogProvider
        apiKey={POSTHOG_CONFIG.apiKey}
        autocapture={{
          captureScreens: false,
          navigationRef,
        }}
        options={{
          host: POSTHOG_CONFIG.host,
          captureAppLifecycleEvents: true,
        }}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="CompanyDetails" component={CompanyDetailsPage} />
          <Stack.Screen name="ValueScore" component={ValueScorePage} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyPage} />
        </Stack.Navigator>
      </PostHogProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;
