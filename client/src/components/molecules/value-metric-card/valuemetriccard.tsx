import React from 'react';
import { ValueMetricCardProps } from './valuemetriccard.interface';
import { ExpandableCard } from '../expandable-card/expandablecard';
import {
  CardContainer,
  ScoreSection,
  ScoreLabel,
  ProgressContainer,
  ProgressBar,
  ProgressBarFill,
  ScoreValue,
  Assessment,
  Description,
} from './valuemetriccard.styles';

export const ValueMetricCard: React.FC<ValueMetricCardProps> = ({
  title,
  value,
  score,
  assessment,
  description,
  color,
}) => {
  // Normalize score: coerce to number, handle NaN, clamp to 0-100 range
  const normalizedScore = Math.max(0, Math.min(100, Number(score) || 0));

  // Convert value to string for ExpandableCard compatibility
  const displayValue = value !== null && value !== undefined
    ? (typeof value === 'number' ? value.toString() : value)
    : 'N/A';

  return (
    <CardContainer>
      <ExpandableCard title={title} value={displayValue}>
        <ScoreSection>
          <ScoreLabel>Value Score:</ScoreLabel>
          <ProgressContainer>
            <ProgressBar progress={normalizedScore}>
              <ProgressBarFill progress={normalizedScore} />
            </ProgressBar>
            <ScoreValue>{normalizedScore}/100</ScoreValue>
          </ProgressContainer>
        </ScoreSection>

        <Assessment color={color}>{assessment || ''}</Assessment>
        <Description>{description || ''}</Description>
      </ExpandableCard>
    </CardContainer>
  );
};
