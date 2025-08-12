import React from 'react';
import { HeaderProps } from './header.interface';
import { HeaderContainer, Title } from './header.styles';

export const Header: React.FC<HeaderProps> = ({
  title,
  // onInfoPress, // Commented out with info icon
  ...props
}) => {
  return (
    <HeaderContainer {...props}>
      <Title>{title}</Title>
      {/* <Pressable onPress={onInfoPress} testID="info-button">
        <InfoIcon fill="#000000" />
      </Pressable> */}
    </HeaderContainer>
  );
};
