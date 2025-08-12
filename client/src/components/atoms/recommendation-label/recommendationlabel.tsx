import React from 'react';
import { RecommendationLabelProps } from './recommendationlabel.interface';
import { Container, Text } from './recommendationlabel.styles';

export const RecommendationLabel: React.FC<RecommendationLabelProps> = ({
  recommendation,
  ...props
}) => {
  const getVariant = (recommendation: string) => {
    switch (recommendation) {
      case 'Buy':
        return 'secondary';
      case 'Buy +':
        return 'success';
      case 'Hold':
        return 'warning';
      case 'Avoid':
        return 'danger';
      default:
        return 'primary';
    }
  };

  return (
    <Container variant={getVariant(recommendation)} {...props}>
      <Text variant={getVariant(recommendation)}>{recommendation}</Text>
    </Container>
  );
};
