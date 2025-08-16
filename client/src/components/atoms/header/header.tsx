import React from 'react';
import { Pressable } from 'react-native';
import { HeaderProps } from './header.interface';
import { HeaderContainer, Title } from './header.styles';
import InfoIcon from '../icons/info';

export const Header: React.FC<HeaderProps> = ({
  title,
  onPress,
  ...props
}) => {

  return (
    <HeaderContainer {...props}>
      <Title>{title}</Title>
      {(onPress) && (
        <Pressable onPress={onPress} testID="info-button">
          <InfoIcon fill="#000000" />
        </Pressable>
      )}
    </HeaderContainer>
  );
};
