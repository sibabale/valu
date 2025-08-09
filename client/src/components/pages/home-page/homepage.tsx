import React, { useState, useEffect } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomePageProps } from './homepage.interface';
import { PageContainer, PaddedContent, ContentContainer } from './homepage.styles';
import { Header } from '../../atoms/header/header';
import { Searchbar } from '../../atoms/searchbar/searchbar';
import { CompanyList } from '../../organisms/company-list/companylist';
import { Company } from '../../../types/company.interface';
import companiesData from '../../../data/companies.json';

export const HomePage: React.FC<HomePageProps> = ({
  onCompanyPress,
  onInfoPress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const filtered = companiesData.filter((company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.ticker.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [searchQuery]);

  useEffect(() => {
    setFilteredCompanies(companiesData);
  }, []);

  const handleCompanyPress = (company: Company) => {
    onCompanyPress?.(company);
  };

  const handleInfoPress = () => {
    onInfoPress?.();
  };

  const handleStockSelect = (stock: string) => {
    setSearchQuery(stock);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <PageContainer>
        <PaddedContent>
          <Header title="VALU" onInfoPress={handleInfoPress} />

          <Searchbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </PaddedContent>
        <ContentContainer>
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