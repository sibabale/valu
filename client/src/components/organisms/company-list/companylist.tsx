import React, { useState, useEffect } from 'react';
import { ScrollView, Animated } from 'react-native';
import { CompanyListProps } from './companylist.interface';
import { ListContainer, EmptyContainer, EmptyText } from './companylist.styles';
import { CompanyCard } from '../../molecules/company-card/companycard';

export const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  onCompanyPress,
  bottomInset = 0,
  isLoading = false,
  error = null,
}) => {
  const [displayedCompanies, setDisplayedCompanies] = useState<any[]>([]);
  const [animatedCompanies, setAnimatedCompanies] = useState<Animated.Value[]>([]);

  // Reset displayed companies when new data comes in
  useEffect(() => {
    if (companies && companies.length > 0) {
      // Clear any existing timeouts
      const timeouts: ReturnType<typeof setTimeout>[] = [];

      // Start with empty array
      setDisplayedCompanies([]);
      setAnimatedCompanies([]);

      // Populate one by one with animation
      companies.forEach((company, index) => {
        const timeout = setTimeout(() => {
          setDisplayedCompanies(prev => [...prev, { ...company, animationId: Date.now() + index }]);

          // Create animation value for this company
          const animValue = new Animated.Value(0);
          setAnimatedCompanies(prev => [...prev, animValue]);

          // Animate the new company in
          Animated.timing(animValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }).start();
        }, index * 100); // 100ms delay between each company

        timeouts.push(timeout);
      });

      // Cleanup function
      return () => {
        timeouts.forEach(clearTimeout);
      };
    }
  }, [companies]);

  if (isLoading) {
    return (
      <EmptyContainer>
        <EmptyText>Loading companies...</EmptyText>
      </EmptyContainer>
    );
  }

  if (error) {
    return (
      <EmptyContainer>
        <EmptyText>{error}</EmptyText>
      </EmptyContainer>
    );
  }

  if (!companies || !Array.isArray(companies) || companies.length === 0) {
    return (
      <EmptyContainer>
        <EmptyText>No companies found</EmptyText>
      </EmptyContainer>
    );
  }

  return (
    <ListContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: Math.max(16, bottomInset + 16),
          paddingHorizontal: 20,
        }}
      >
        {displayedCompanies.map((company, index) => {
          const animValue = animatedCompanies[index];

          return (
            <Animated.View
              key={company.animationId || `${company.id}-${index}`}
              style={{
                marginBottom: 8,
                opacity: animValue || 0,
                transform: [
                  {
                    translateY: animValue ? animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }) : 50,
                  },
                  {
                    scale: animValue ? animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }) : 0.9,
                  },
                ],
              }}
            >
              <CompanyCard
                company={company}
                onPress={() => onCompanyPress?.(company)}
              />
            </Animated.View>
          );
        })}
      </ScrollView>
    </ListContainer>
  );
};
