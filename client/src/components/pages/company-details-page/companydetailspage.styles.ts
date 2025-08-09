import styled from 'styled-components/native';

export const PageContainer = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

export const ContentContainer = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

export const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
`;

export const BackButton = styled.TouchableOpacity`
  padding: 8px;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333333;
`;

export const InfoButton = styled.TouchableOpacity`
  padding: 8px;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  margin: 16px 0 8px 0;
`;
