import { ReactNode } from 'react';

export interface ExpandableCardProps {
  title: string;
  value: string;
  subtitle?: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  onToggle?: (isExpanded: boolean) => void;
}
