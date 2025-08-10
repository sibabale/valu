import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import pages directly
import { 
  HomePage, 
  ProfilePage, 
  SettingsPage, 
  CompanyDetailsPage, 
  ValueScorePage 
} from '../components/pages';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="Settings" component={SettingsPage} />
        <Stack.Screen name="CompanyDetails" component={CompanyDetailsPage} />
        <Stack.Screen name="ValueScore" component={ValueScorePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
