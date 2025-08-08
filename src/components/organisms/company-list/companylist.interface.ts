import { Company } from '../../types/company.interface';

export interface CompanyListProps {
  companies: Company[];
  onCompanyPress?: (company: Company) => void;
}
