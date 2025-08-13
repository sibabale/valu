import styled from 'styled-components/native';
import { theme } from '../../../utils/theme';

export const PageContainer = styled.View`
  flex: 1;
  background-color: ${theme.colors.background.primary};
`;

export const ContentContainer = styled.ScrollView`
  flex: 1;
  padding: ${theme.spacing.md}px;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.lg}px ${theme.spacing.md}px;
  background-color: ${theme.colors.background.secondary};
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
  position: relative;
`;

export const BackButton = styled.TouchableOpacity`
  padding: ${theme.spacing.sm}px;
  position: absolute;
  left: ${theme.spacing.md}px;
  z-index: 1;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text.primary};
  font-family: ${theme.fonts.bold};
`;

export const InfoButton = styled.TouchableOpacity`
  padding: ${theme.spacing.sm}px;
  position: absolute;
  right: ${theme.spacing.md}px;
  z-index: 1;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text.primary};
  margin: ${theme.spacing.lg}px 0 ${theme.spacing.md}px 0;
  font-family: ${theme.fonts.bold};
`;
