import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

export const Button = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 15px 30px;
  border-radius: 8px;
  margin: 10px 0;
  flex-direction: row;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
  margin-left: 10px;
`;

export const StatusText = styled.Text`
  font-size: 16px;
  color: #666;
  margin: 10px 0;
`;
