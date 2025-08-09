import React, { useState } from 'react';
import { FinancialRatioCardProps } from './financialratiocard.interface';
import {
  CardContainer,
  MainContent,
  LeftSection,
  Title,
  Description,
  RightSection,
  Value,
  TrendContainer,
  TrendText,
  ExpandedContent,
  ExpandedDescription,
} from './financialratiocard.styles';
import { Ionicons } from '@expo/vector-icons';

const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return 'trending-up';
    case 'down':
      return 'trending-down';
    default:
      return 'remove';
  }
};

const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return '#28a745';
    case 'down':
      return '#dc3545';
    default:
      return '#666666';
  }
};

export const FinancialRatioCard: React.FC<FinancialRatioCardProps> = ({
  title,
  value,
  trend,
  description,
  onPress,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    setIsExpanded(!isExpanded);
    if (onPress) {
      onPress();
    }
  };

  return (
    <CardContainer onPress={handlePress} activeOpacity={0.8}>
      <MainContent>
        <LeftSection>
          <Title>{title}</Title>
          {!isExpanded && description && <Description>{description}</Description>}
        </LeftSection>

        <RightSection>
          <Value>{value}</Value>
          <TrendContainer trend={trend}>
            <Ionicons
              name={getTrendIcon(trend) as any}
              size={16}
              color={getTrendColor(trend)}
            />
            <TrendText trend={trend}>
              {trend === 'up' ? 'Up' : trend === 'down' ? 'Down' : 'Neutral'}
            </TrendText>
          </TrendContainer>
        </RightSection>
      </MainContent>
      
      {isExpanded && (
        <ExpandedContent>
          <ExpandedDescription>{description}</ExpandedDescription>
        </ExpandedContent>
      )}
    </CardContainer>
  );
};
