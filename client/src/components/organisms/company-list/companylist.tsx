import React from 'react';
import { ScrollView, View } from 'react-native';
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
        {companies.map(company => {
          return (
            <View key={company.id} style={{ marginBottom: 8 }}>
              <CompanyCard
                company={company}
                onPress={() => onCompanyPress?.(company)}
              />
            </View>
          );
        })}
      </ScrollView>
    </ListContainer>
  );
};
