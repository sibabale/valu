import React, { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { PageContainer, PaddedContent, ContentContainer } from './homepage.styles';
import { Header } from '../../atoms/header/header';
import { Searchbar } from '../../atoms/searchbar/searchbar';
import { CompanyList } from '../../organisms/company-list/companylist';
import { Company } from '../../../types/company.interface';

export const HomePage: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const insets = useSafeAreaInsets();

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
    
    // Info modal logic would go here
  };

  // Fetch companies from API
  useEffect(() => {
    console.log('HomePage: Fetching companies');
    const fetchCompanies = async () => {
      try {
        const response = await fetch('https://b01068571f2b.ngrok-free.app/api/companies');
        console.log('-----HomePage: Response-----', response);
        if (response.ok) {
          const apiCompanies = await response.json();
          // Transform API data to match our Company interface
          const transformedCompanies = apiCompanies.map((apiCompany: any) => {
            console.log(apiCompany.recommendation);
            
            return {
            id: apiCompany.id,
            name: apiCompany.name,
            ticker: apiCompany.symbol,
            logo: apiCompany.symbol.charAt(0).toUpperCase(),
            price: apiCompany.price || 0,
            recommendation: apiCompany.recommendation,
            logoColor: '#4285F4',
          };
        });

          console.log('-----transformedCompanies-----', transformedCompanies.map((company: any) => company.recommendation));
          setCompanies(transformedCompanies);
          setFilteredCompanies(transformedCompanies);
        }
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        // Fallback to empty array
        setCompanies([]);
        setFilteredCompanies([]);
      }
    };

    fetchCompanies();
    
    // Start cascading animations after a brief delay to ensure state is set
    const timer = setTimeout(() => {
      
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
    if (companies.length > 0) {
      const filtered = companies.filter((company: Company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.ticker.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery, companies]);

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