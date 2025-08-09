import React from 'react';
import { ScrollView, View } from 'react-native';
import { CompanyListProps } from './companylist.interface';
import { ListContainer, EmptyContainer, EmptyText } from './companylist.styles';
import { CompanyCard } from '../../molecules/company-card/companycard';

export const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  onCompanyPress,
  bottomInset = 0,
}) => {
  console.log('CompanyList render - companies prop:', companies);
  console.log('CompanyList render - companies count:', companies?.length);
  console.log('CompanyList render - companies type:', typeof companies);
  console.log('CompanyList render - companies is array:', Array.isArray(companies));

  if (!companies || !Array.isArray(companies) || companies.length === 0) {
    console.log('CompanyList: No companies to render');
    return (
      <EmptyContainer>
        <EmptyText>No companies found</EmptyText>
      </EmptyContainer>
    );
  }

  console.log('CompanyList: Rendering', companies.length, 'companies');

  const keyExtractor = (item: any) => item.id.toString();

  return (
    <ListContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: 16, 
          paddingBottom: Math.max(16, bottomInset + 16), 
          paddingHorizontal: 20 
        }}
      >
        {companies.map((company, index) => {
          console.log(`Rendering card ${index}:`, company.name);
          
          return (
            <View key={keyExtractor(company)} style={{ marginBottom: 8 }}>
              <CompanyCard company={company} onPress={() => onCompanyPress?.(company)} />
            </View>
          );
        })}
      </ScrollView>
    </ListContainer>
  );
};
