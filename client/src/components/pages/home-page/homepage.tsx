import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { HomePageProps } from './homepage.interface';
import { PageContainer, PaddedContent, ContentContainer } from './homepage.styles';
import { Header } from '../../atoms/header/header';
import { SearchBar } from '../../atoms/searchbar/searchbar';
import { CompanyList } from '../../organisms/company-list/companylist';
import { Company } from '../../../types/company.interface';
import companiesData from '../../../data/companies.json';


export const HomePage: React.FC<HomePageProps> = ({
  onCompanyPress,
  onInfoPress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageContainer>
        <PaddedContent>
          <Header title="VALU" onInfoPress={handleInfoPress} />
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search"
          />
        </PaddedContent>
        <ContentContainer>
          <CompanyList
            companies={filteredCompanies}
            onCompanyPress={handleCompanyPress}
          />
        </ContentContainer>
      </PageContainer>
    </SafeAreaView>
  );
}; 