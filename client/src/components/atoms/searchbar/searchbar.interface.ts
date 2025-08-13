import { Company } from '../../../types/company.interface';

export interface SearchbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  popularStocks?: string[];
  companiesData?: Company[];
}
