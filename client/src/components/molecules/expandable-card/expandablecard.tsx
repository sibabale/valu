import React, { useState, useRef } from 'react';
import { LayoutAnimation, Platform, UIManager, Animated, Easing } from 'react-native';
import { ExpandableCardProps } from './expandablecard.interface';
import {
  Container,
  Header,
  HeaderLeft,
  HeaderRight,
  Title,
  Value,
  Content,
  Subtitle,
  ContentWrapper,
} from './expandablecard.styles';
import ChevronUpIcon from '../../atoms/icons/chevron-up';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  title,
  value,
  subtitle,
  children,
  defaultExpanded = false,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const rotationValue = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;

  const toggleExpanded = () => {
    const customLayoutAnimation = {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleY,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    };
    
    LayoutAnimation.configureNext(customLayoutAnimation);
    
    Animated.timing(rotationValue, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      useNativeDriver: true,
    }).start();

    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  };

  const rotateAnimation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Container>
      <Header onPress={toggleExpanded}>
        <HeaderLeft>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </HeaderLeft>
        <HeaderRight>
          <Value>{value}</Value>
          <Animated.View
            style={{
              transform: [{ rotate: rotateAnimation }],
            }}
          >
            <ChevronUpIcon fill="#666666" />
          </Animated.View>
        </HeaderRight>
      </Header>
      
      {isExpanded && (
        <Content>
          <ContentWrapper>{children}</ContentWrapper>
        </Content>
      )}
    </Container>
  );
};