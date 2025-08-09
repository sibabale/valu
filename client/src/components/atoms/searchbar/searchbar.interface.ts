export interface SearchbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  popularStocks?: string[];
}
