import React from 'react';
import { FinancialRatioCardProps } from './financialratiocard.interface';
import {
  CardContainer,
  LeftSection,
  Title,
  Description,
  RightSection,
  Value,
  TrendContainer,
  TrendText,
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
  return (
    <CardContainer onPress={onPress} activeOpacity={0.8}>
      <LeftSection>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
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
    </CardContainer>
  );
};
