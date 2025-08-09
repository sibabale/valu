import React from 'react';
import { PERatioSectionProps } from './peratiosection.interface';
import {
  SectionContainer,
  HeaderSection,
  Title,
  ValueContainer,
  Value,
  TrendContainer,
  TrendText,
  ScoreSection,
  ScoreLabel,
  ProgressBarContainer,
  ProgressBar,
  ScoreValue,
  Assessment,
  Description,
} from './peratiosection.styles';
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

export const PERatioSection: React.FC<PERatioSectionProps> = ({
  peRatio,
  valueScore,
  trend,
  assessment,
  description,
  onPress: _onPress,
}) => {
  return (
    <SectionContainer>
      <HeaderSection>
        <Title>PE Ratio</Title>
        <ValueContainer>
          <Value>{peRatio}</Value>
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
        </ValueContainer>
      </HeaderSection>

      <ScoreSection>
        <ScoreLabel>Value Score:</ScoreLabel>
        <ProgressBarContainer>
          <ProgressBar progress={valueScore} />
        </ProgressBarContainer>
        <ScoreValue>{valueScore}/100</ScoreValue>
      </ScoreSection>

      <Assessment>{assessment}</Assessment>
      <Description>{description}</Description>
    </SectionContainer>
  );
};
