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
  return (
    <CardContainer>
      <ExpandableCard title={title} value={value?.toString() || 'N/A'}>
        <ScoreSection>
          <ScoreLabel>Value Score:</ScoreLabel>
          <ProgressContainer>
            <ProgressBar progress={score || 0}>
              <ProgressBarFill progress={score || 0} />
            </ProgressBar>
            <ScoreValue>{score || 0}/100</ScoreValue>
          </ProgressContainer>
        </ScoreSection>

        <Assessment color={color}>{assessment || ''}</Assessment>
        <Description>{description || ''}</Description>
      </ExpandableCard>
    </CardContainer>
  );
};
