import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomePage } from '../components/pages';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleCompanyPress = (company: any) => {
    // Navigate to company details screen with the company data
    (navigation as any).navigate('CompanyDetails', { company });
  };

  const handleInfoPress = () => {
    console.log('Info pressed');
    // Info modal logic would go here
  };

  // Show the HomePage component for the main app functionality
  return (
    <HomePage
      onCompanyPress={handleCompanyPress}
      onInfoPress={handleInfoPress}
    />
  );
};

export default HomeScreen;
