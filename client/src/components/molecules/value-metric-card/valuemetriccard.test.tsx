import { render, screen } from '@testing-library/react-native';
import { ValueMetricCard } from './valuemetriccard';

// Mock the ExpandableCard to always be expanded
jest.mock('../expandable-card/expandablecard', () => ({
  ExpandableCard: ({ children, title, value, subtitle }: any) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return (
      <View>
        <Text>{title}</Text>
        <Text>{value}</Text>
        <Text>{subtitle}</Text>
        {children}
      </View>
    );
  },
}));

describe('ValueMetricCard', () => {
  const defaultProps = {
    title: 'P/E Ratio',
    value: 15.5,
    score: 75,
    assessment: 'Good value (P/E < 25)',
    description:
      'Price-to-Earnings ratio measures how much investors are willing to pay per dollar of earnings.',
  };

  it('renders assessment text', () => {
    render(<ValueMetricCard {...defaultProps} />);

    expect(screen.getByText('Good value (P/E < 25)')).toBeTruthy();
  });

  it('renders description text', () => {
    render(<ValueMetricCard {...defaultProps} />);

    expect(
      screen.getByText(
        'Price-to-Earnings ratio measures how much investors are willing to pay per dollar of earnings.'
      )
    ).toBeTruthy();
  });

  it('renders score value', () => {
    render(<ValueMetricCard {...defaultProps} />);

    expect(screen.getByText('75/100')).toBeTruthy();
  });

  it('renders with color prop', () => {
    render(<ValueMetricCard {...defaultProps} color="success" />);

    expect(screen.getByText('Good value (P/E < 25)')).toBeTruthy();
  });

  it('handles missing score gracefully', () => {
    render(<ValueMetricCard {...defaultProps} score={0} />);

    expect(screen.getByText('0/100')).toBeTruthy();
  });

  it('handles empty assessment gracefully', () => {
    render(<ValueMetricCard {...defaultProps} assessment="" />);

    // Should not crash and should render the component
    expect(screen.getAllByText('Value Score:')).toBeTruthy();
  });

  it('handles empty description gracefully', () => {
    render(<ValueMetricCard {...defaultProps} description="" />);

    // Should not crash and should render the component
    expect(screen.getAllByText('Value Score:')).toBeTruthy();
  });
});
