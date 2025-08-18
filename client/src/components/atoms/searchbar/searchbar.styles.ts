import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

export const Container = styled.View`
  position: relative;
  width: 100%;
`;

export const SearchContainer = styled.View<{ isFocused: boolean; disabled?: boolean }>`
  flex-direction: row;
  align-items: center;
  height: 47px;
  border-radius: 24px;
  border: ${(props: { isFocused: boolean; disabled?: boolean }) =>
    props.disabled ? '1px solid #e5e7eb' : props.isFocused ? '2px solid #d1d5db' : '1px solid #e5e7eb'};
  background-color: ${(props: { disabled?: boolean }) => props.disabled ? '#f9fafb' : '#ffffff'};
  padding: 0 16px;
  gap: 12px;
`;

export const SearchIconContainer = styled.View`
  width: 16px;
  height: 16px;
  justify-content: center;
  align-items: center;
`;

export const IconContainer = styled.View`
  width: 16px;
  height: 16px;
  justify-content: center;
  align-items: center;
`;

export const SearchInput = styled.TextInput<{ disabled?: boolean }>`
  flex: 1;
  height: 47px;
  font-size: 18px;
  font-family: 'Space Grotesk';
  color: ${(props: { disabled?: boolean }) => props.disabled ? '#9ca3af' : '#1f2937'};
  background-color: transparent;
`;

export const CloseButton = styled(TouchableOpacity)`
  width: 16px;
  height: 16px;
  justify-content: center;
  align-items: center;
  padding: 8px;
`;

export const ClearButton = styled(TouchableOpacity)`
  padding: 8px;
  height: auto;
`;

export const DropdownContainer = styled.View`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 8px;
`;

export const DropdownCard = styled.View`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #ffffff;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 8;
`;

export const DropdownContent = styled.View`
  padding: 16px;
`;

export const SectionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

export const SectionTitle = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  font-family: 'Space Grotesk';
`;

export const ClearButtonText = styled.Text`
  font-size: 12px;
  color: #6b7280;
  font-family: 'Space Grotesk';
`;

export const TagsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

export const TagButton = styled(TouchableOpacity)`
  padding: 4px 12px;
  height: 28px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
`;

export const TagText = styled.Text`
  font-size: 12px;
  color: #374151;
  font-family: 'Space Grotesk';
`;