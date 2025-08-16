import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Container,
  Header,
  TitleSection,
  Title,
  Description,
  RangeItem,
  RangeItemLast,
  ScoreCircle,
  ScoreText,
  Checkmark,
  RangeContent,
  RangeLabel,
  RangeDescription,
  ProgressBar,
  ProgressBarFill,
  LoadingContainer,
  LoadingText,
} from './metricbreakdowncard.styles';
import { MetricBreakdownCardProps } from './metricbreakdowncard.interface';

export const MetricBreakdownCard: React.FC<MetricBreakdownCardProps> = ({
  title,
  description,
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
      </Header>

      {ranges.map((range, index) => {
        const isLast = index === ranges.length - 1;
        const RangeComponent = isLast ? RangeItemLast : RangeItem;

        return (
          <RangeComponent key={range.label}>
                        <ScoreCircle color={range.color}>
              <ScoreText>{range.score}</ScoreText>
              <Checkmark color={range.color}>
                <Ionicons name="checkmark" size={10} color="white" />
              </Checkmark>
            </ScoreCircle>

            <RangeContent>
              <RangeLabel>{range.label}</RangeLabel>
              <RangeDescription>
                {range.description}
              </RangeDescription>
            </RangeContent>

            <ProgressBar color={range.color} score={range.score}>
              <ProgressBarFill color={range.color} score={range.score} />
            </ProgressBar>
          </RangeComponent>
        );
      })}
    </Container>
  );
};
