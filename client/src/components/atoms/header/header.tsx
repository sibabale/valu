import React from 'react';
import { HeaderProps } from './header.interface';
import { HeaderContainer, Title } from './header.styles';
import { Pressable } from 'react-native';
import InfoIcon from '../icons/info';

export const Header: React.FC<HeaderProps> = ({
  title,
  onInfoPress,
  ...props
}) => {
  return (
    <HeaderContainer {...props}>
      <Title>{title}</Title>
      <Pressable onPress={onInfoPress} testID="info-button">
        <InfoIcon fill="#000000" />
      </Pressable>
    </HeaderContainer>
  );
};
