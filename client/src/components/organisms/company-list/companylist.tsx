import React from 'react';
import { FlatList, View } from 'react-native';
import { CompanyListProps } from './companylist.interface';
import { ListContainer, EmptyContainer, EmptyText } from './companylist.styles';
import { CompanyCard } from '../../molecules/company-card/companycard';

export const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  onCompanyPress,
  bottomInset = 0,
}) => {
  if (companies.length === 0) {
    return (
      <EmptyContainer>
        <EmptyText>No companies found</EmptyText>
      </EmptyContainer>
    );
  }

  const renderItem = ({ item: company }: { item: any }) => (
    <CompanyCard company={company} onPress={() => onCompanyPress?.(company)} />
  );

  const keyExtractor = (item: any) => item.id.toString();

  return (
    <ListContainer>
      <FlatList
        data={companies}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: 16, 
          paddingBottom: Math.max(16, bottomInset + 16), 
          paddingHorizontal: 20 
        }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </ListContainer>
  );
};
