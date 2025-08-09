import React from 'react';
import { FlatList, View } from 'react-native';
import { CompanyListProps } from './companylist.interface';
import { ListContainer, EmptyContainer, EmptyText } from './companylist.styles';
import { CompanyCard } from '../../molecules/company-card/companycard';

export const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  onCompanyPress,
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
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20, paddingHorizontal: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </ListContainer>
  );
};
