import styled from 'styled-components/native';

export const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  margin-bottom: 20px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-family: 'Space Grotesk Bold';
  color: #333333;
`;

export const InfoButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #f2f2f7;
  align-items: center;
  justify-content: center;
`;

export const InfoText = styled.Text`
  font-size: 16px;
  font-family: 'Space Grotesk Bold';
  color: #007aff;
`;
