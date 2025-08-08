import { TouchableOpacityProps } from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'xx-small' | 'x-small' | 'small' | 'medium' | 'large';
  children: React.ReactNode;
}
