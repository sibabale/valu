import React, { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { PageContainer, PaddedContent, ContentContainer } from './homepage.styles';
import { Header } from '../../atoms/header/header';
import { Searchbar } from '../../atoms/searchbar/searchbar';
import { CompanyList } from '../../organisms/company-list/companylist';
import { Company } from '../../../types/company.interface';
import companiesData from '../../../data/companies.json';

export const HomePage: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const insets = useSafeAreaInsets();

  console.log('HomePage render - searchQuery:', searchQuery);
  console.log('HomePage render - filteredCompanies count:', filteredCompanies?.length);

  // Animation values for cascading sequence
  const headerAnim = useRef(new Animated.Value(1)).current; // Start at 1 (normal size)
  const searchAnim = useRef(new Animated.Value(0)).current; // Start at 0 (invisible)
  const listAnim = useRef(new Animated.Value(0)).current; // Start at 0 (invisible)

  // Handle header press animation (like hover effect)
  const handleHeaderPress = () => {
    // Scale up on press
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    console.log('Info pressed');
    // Info modal logic would go here
  };

  // Initialize companies, handle filtering, and start cascading animations
  useEffect(() => {
    console.log('HomePage: Initializing with companies count:', companiesData.length);
    
    // Set initial companies data
    setFilteredCompanies(companiesData);
    
    // Start cascading animations after a brief delay to ensure state is set
    const timer = setTimeout(() => {
      console.log('HomePage: Starting cascading animation sequence');
      
      // 🎬 Cascading Animation Sequence
      // Header (0s) → Search (0.2s) → List (0.4s)
      Animated.sequence([
        // Search slides up from bottom with 0.2s delay
        Animated.delay(200),
        Animated.timing(searchAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        // List fades in with 0.4s total delay
        Animated.delay(200),
        Animated.timing(listAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 100); // Small delay to ensure state is set

    return () => clearTimeout(timer);
  }, []); // Only run once on mount

  // Handle search filtering separately
  useEffect(() => {
    if (companiesData.length > 0) {
      console.log('HomePage: Filtering companies for query:', searchQuery);
      const filtered = companiesData.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.ticker.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('HomePage: Filtered companies count:', filtered.length);
      setFilteredCompanies(filtered);
    }
  }, [searchQuery]);

  const handleCompanyPress = (company: Company) => {
    // Navigate to company details screen with the company data
    (navigation as any).navigate('CompanyDetails', { company });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <PageContainer>
        {/* Header Section */}
        <PaddedContent>
          <Animated.View
            style={{
              opacity: 1, // Always visible
              transform: [{
                scale: headerAnim, // Scale from 1 to 1.05 on press
              }],
            }}
          >
            <Header title="VALU" onInfoPress={handleHeaderPress} />
          </Animated.View>
        </PaddedContent>

        {/* Search Section - Separate container with higher z-index */}
        <Animated.View
          style={{
            opacity: searchAnim,
            transform: [{
              translateY: searchAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0], // Slide up from below
              }),
            }, {
              scale: searchAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1], // Subtle scale effect
              }),
            }],
            zIndex: 1000, // Higher z-index to ensure dropdown appears above cards
            elevation: 1000, // For Android
            position: 'relative',
          }}
        >
          <PaddedContent>
            <Searchbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </PaddedContent>
        </Animated.View>
        
        {/* Content container - Lower z-index */}
        <ContentContainer style={{ zIndex: 1, elevation: 1 }}>
          <CompanyList
            companies={filteredCompanies}
            onCompanyPress={handleCompanyPress}
            bottomInset={insets.bottom}
          />
        </ContentContainer>
      </PageContainer>
    </SafeAreaView>
  );
}; 