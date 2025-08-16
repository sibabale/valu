import React, { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  PageContainer,
  PaddedContent,
  ContentContainer,
} from './homepage.styles';
import { Header } from '../../atoms/header/header';
import { Searchbar } from '../../atoms/searchbar/searchbar';
import { CompanyList } from '../../organisms/company-list/companylist';
import { Company } from '../../../types/company.interface';
import { API_ENDPOINTS } from '../../../utils/config';
import { usePostHog } from 'posthog-react-native';

export const HomePage: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [companiesData, setCompaniesData] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const posthog = usePostHog();

  // Animation values for cascading sequence
  const searchAnim = useRef(new Animated.Value(0)).current; // Start at 0 (invisible)

  // Track app opened event when component mounts
  useEffect(() => {
    if (posthog) {
      posthog.capture('app_opened', {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      });
    }
  }, [posthog]);

  // Fetch companies from API
  useEffect(() => {
    const controller = new AbortController();

    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(API_ENDPOINTS.companies, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'ValuApp/1.0',
          },
        });


        // Check if request was aborted
        if (controller.signal.aborted) {
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const companies = await response.json();


        // Check if request was aborted before setting state
        if (controller.signal.aborted) {
          return;
        }

        setCompaniesData(companies);
        setFilteredCompanies(companies);

        // Track successful companies load
        if (posthog) {
          posthog.capture('companies_loaded', {
            count: companies.length,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (err) {
        // Check if the error is due to abort
        if (err instanceof DOMException && err.name === 'AbortError') {
          return; // Don't set error state for aborted requests
        }

        // Check if request was aborted before setting error state
        if (controller.signal.aborted) {
          return;
        }


        setError('Failed to load companies');
        setCompaniesData([]);
        setFilteredCompanies([]);

        // Track error
        if (posthog) {
          posthog.capture('error_occurred', {
            error: err instanceof Error ? err.message : 'Unknown error',
            context: 'companies_fetch',
            timestamp: new Date().toISOString(),
          });
        }
      } finally {
        // Only update loading state if not aborted
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchCompanies();

    // Cleanup function to abort inflight requests on unmount
    return () => {
      controller.abort();
    };
  }, []);

  // Handle header press - navigate to privacy policy
  const handleHeaderPress = () => {
    // Navigate to privacy policy page
    (navigation as any).navigate('PrivacyPolicy');
  };

  // Fetch companies from API
  useEffect(() => {
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
      ]).start();
    }, 100); // Small delay to ensure state is set

    return () => clearTimeout(timer);
  }, [companiesData.length, searchAnim]); // Run when companies data changes

  // Handle search filtering separately
  useEffect(() => {
    if (companiesData.length > 0) {
      const filtered = companiesData.filter(
        (company: Company) => {
          const name = company.name?.toLowerCase() || '';
          const symbol = company.symbol?.toLowerCase() || '';
          const sector = company.sector?.toLowerCase() || '';
          const industry = company.industry?.toLowerCase() || '';
          const query = searchQuery.toLowerCase();

          return name.includes(query) || symbol.includes(query) || sector.includes(query) || industry.includes(query);
        }
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery, companiesData]);

  const handleCompanyPress = (company: Company) => {
    // Track company viewed event
    if (posthog) {
      posthog.capture('company_viewed', {
        company_id: company.id,
        company_name: company.name,
        company_symbol: company.symbol,
        recommendation: company.recommendation,
        score: company.score,
        timestamp: new Date().toISOString(),
      });
    }

    // Navigate to company details screen with the company data
    (navigation as any).navigate('CompanyDetails', { company });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <PageContainer>
        {/* Header Section */}
        <PaddedContent>
          <Header title="VALU" onInfoPress={handleHeaderPress} />
        </PaddedContent>

        {/* Search Section - Separate container with higher z-index */}
        <Animated.View
          style={{
            opacity: searchAnim,
            transform: [
              {
                translateY: searchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0], // Slide up from below
                }),
              },
              {
                scale: searchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1], // Subtle scale effect
                }),
              },
            ],
            zIndex: 1000, // Higher z-index to ensure dropdown appears above cards
            elevation: 1000, // For Android
            position: 'relative',
          }}
        >
          <PaddedContent>
            <Searchbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              companiesData={companiesData}
              disabled={isLoading || !!error || !companiesData.length}
            />
          </PaddedContent>
        </Animated.View>

        {/* Content container - Lower z-index */}
        <ContentContainer style={{ zIndex: 1, elevation: 1 }}>
          <CompanyList
            companies={filteredCompanies}
            onCompanyPress={handleCompanyPress}
            bottomInset={insets.bottom}
            isLoading={isLoading}
            error={error}
          />
        </ContentContainer>
      </PageContainer>
    </SafeAreaView>
  );
};
