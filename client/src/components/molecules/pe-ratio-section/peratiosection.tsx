import React from 'react';
import { PERatioSectionProps } from './peratiosection.interface';
import { ExpandableCard } from '../expandable-card/expandablecard';
import {
  ScoreSection,
  ScoreLabel,
  ProgressContainer,
  ProgressBar,
  ProgressBarFill,
  ScoreValue,
  Assessment,
  Description,
} from './peratiosection.styles';

export const PERatioSection: React.FC<PERatioSectionProps> = ({
  peRatio,
  valueScore,
  assessment,
  description,
}) => {
  return (
    <ExpandableCard
      title="PE Ratio"
      value={peRatio?.toString() || 'N/A'}
      subtitle="Value Score:"
    >
      <ScoreSection>
        <ScoreLabel>Value Score:</ScoreLabel>
        <ProgressContainer>
          <ProgressBar progress={valueScore || 0}>
            <ProgressBarFill progress={valueScore || 0} />
          </ProgressBar>
          <ScoreValue>{valueScore || 0}/100</ScoreValue>
        </ProgressContainer>
      </ScoreSection>

      <Assessment>{assessment || ''}</Assessment>
      <Description>{description || ''}</Description>
    </ExpandableCard>
  );
};