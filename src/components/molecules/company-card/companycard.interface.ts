import { TouchableOpacityProps } from 'react-native';
import { Company } from '../../../types/company.interface';

export interface CompanyCardProps extends TouchableOpacityProps {
  company: Company;
  onPress?: () => void;
}
