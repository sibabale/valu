export interface ValueMetricCardProps {
  title: string;
  /**
   * The value to display. Can be a number (for automatic formatting) or a preformatted string.
   * TODO: Migrate callers to use preformatted strings for better control over display format.
   */
  value: number | string;
  score: number;
  assessment: string;
  description: string;
  color?: string;
}
