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
  Subtitle,
  Content,
  ContentWrapper,
} from './expandablecard.styles';

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
  const rotationValue = useRef(new Animated.Value(defaultExpanded ? 0 : 1)).current;

  const toggleExpanded = () => {
    const customLayoutAnimation = {
      duration: 350,
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
      toValue: isExpanded ? 1 : 0,
      duration: 350,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
      useNativeDriver: true,
    }).start();

    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle?.(newState);
  };

  return (
    <Container>
      <Header onPress={toggleExpanded}>
        <HeaderLeft>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </HeaderLeft>
        <HeaderRight>
          <Value>{value}</Value>
          <Animated.Text
            style={{
              fontSize: 16,
              color: '#666666',
              fontWeight: 'bold',
              transform: [
                {
                  rotate: rotationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
            }}
          >
            ^
          </Animated.Text>
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