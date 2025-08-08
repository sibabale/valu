import { TouchableOpacityProps } from 'react-native';

export interface HeaderProps extends TouchableOpacityProps {
  title: string;
  onInfoPress?: () => void;
}
