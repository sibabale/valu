import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  border-width: 1px;
  border-color: #f0f0f0;
  margin-bottom: 16px;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 8px;
  elevation: 2;
`;

export const Header = styled.TouchableOpacity.attrs({
  activeOpacity: 0.7,
  underlayColor: 'transparent',
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
`;

export const HeaderLeft = styled.View`
  flex: 1;
`;

export const HeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-family: 'Space Grotesk Bold';
  color: #1a1a1a;
  margin-bottom: 2px;
`;

export const Value = styled.Text`
  font-size: 20px;
  font-family: 'Space Grotesk Bold';
  color: #1a1a1a;
  margin-right: 8px;
`;

export const Subtitle = styled.Text`
  font-size: 12px;
  font-family: 'Space Grotesk';
  color: #666666;
`;


export const Content = styled.View`
  border-top-width: 1px;
  border-top-color: #f0f0f0;
  background-color: #ffffff;
  margin: 0 16px;
`;

export const ContentWrapper = styled.View`
  padding: 16px;
`;