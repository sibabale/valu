import React, { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Normalize score: coerce to number, handle NaN, clamp to 0-100 range
  const normalizedScore = Math.max(0, Math.min(100, Number(score) || 0));

  // Convert value to string for ExpandableCard compatibility
  const displayValue = value !== null && value !== undefined
    ? (typeof value === 'number' ? value.toString() : value)
    : 'N/A';

  // Animate progress bar when card expands
  useEffect(() => {
    if (isExpanded) {
      // Reset to 0 first
      progressAnim.setValue(0);
      setAnimatedScore(0);

      // Animate progress bar from 0 to target score
      Animated.timing(progressAnim, {
        toValue: normalizedScore,
        duration: 800,
        useNativeDriver: false,
      }).start();

      // Animate score number from 0 to target
      const startTime = Date.now();
      const duration = 800;
      
      const animateScore = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentScore = Math.round(progress * normalizedScore);
        
        setAnimatedScore(currentScore);
        
        if (progress < 1) {
          requestAnimationFrame(animateScore);
        }
      };
      
      requestAnimationFrame(animateScore);
    } else {
      // Reset animations when collapsed
      progressAnim.setValue(0);
      setAnimatedScore(0);
    }
  }, [isExpanded, normalizedScore, progressAnim]);

  const handleToggle = (expanded: boolean) => {
    setIsExpanded(expanded);
  };

  return (
    <CardContainer>
      <ExpandableCard title={title} value={displayValue} onToggle={handleToggle}>
        <ScoreSection>
          <ScoreLabel>Value Score:</ScoreLabel>
          <ProgressContainer>
            <ProgressBar progress={normalizedScore}>
              <Animated.View
                style={{
                  height: '100%',
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: color === 'success' ? '#4CAF50' :
                                  color === 'secondary' ? '#2196F3' :
                                  color === 'warning' ? '#FF9800' :
                                  color === 'danger' ? '#F44336' :
                                  normalizedScore >= 80 ? '#4CAF50' :
                                  normalizedScore >= 60 ? '#FF9800' :
                                  normalizedScore >= 40 ? '#FFC107' : '#F44336',
                  borderRadius: 4,
                }}
              />
            </ProgressBar>
            <ScoreValue>{animatedScore}/100</ScoreValue>
          </ProgressContainer>
        </ScoreSection>

        <Assessment color={color}>{assessment || ''}</Assessment>
        <Description>{description || ''}</Description>
      </ExpandableCard>
    </CardContainer>
  );
};
