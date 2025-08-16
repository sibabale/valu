import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Container,
  Header,
  TitleSection,
  Title,
  Description,
  OverallScore,
  OverallScoreText,
  RangeItem,
  RangeItemLast,
  ScoreCircle,
  ScoreText,
  Checkmark,
  RangeContent,
  RangeLabel,
  RangeDescription,
  ProgressBar,
  LoadingContainer,
  LoadingText,
} from './metricbreakdowncard.styles';
import { MetricBreakdownCardProps } from './metricbreakdowncard.interface';

export const MetricBreakdownCard: React.FC<MetricBreakdownCardProps> = ({
  title,
  description,
  overallScore,
  ranges,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#007AFF" />
          <LoadingText>Loading metric data...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <TitleSection>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </TitleSection>
        <OverallScore>
          <OverallScoreText>{overallScore}%</OverallScoreText>
        </OverallScore>
      </Header>

      {ranges.map((range, index) => {
        const isLast = index === ranges.length - 1;
        const RangeComponent = isLast ? RangeItemLast : RangeItem;

        return (
          <RangeComponent key={range.label}>
            <ScoreCircle color={range.color} isActive={range.isActive}>
              <ScoreText isActive={range.isActive}>{range.score}</ScoreText>
              {range.isActive && (
                <Checkmark color={range.color}>
                  <Ionicons name="checkmark" size={10} color="white" />
                </Checkmark>
              )}
            </ScoreCircle>

            <RangeContent>
              <RangeLabel isActive={range.isActive}>{range.label}</RangeLabel>
              <RangeDescription isActive={range.isActive}>
                {range.description}
              </RangeDescription>
            </RangeContent>

            <ProgressBar color={range.color} isActive={range.isActive} />
          </RangeComponent>
        );
      })}
    </Container>
  );
};
