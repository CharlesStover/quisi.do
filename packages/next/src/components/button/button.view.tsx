import type { ReactElement, ReactNode } from 'react';
import DesignSystem from '../design-system';

export interface Props {
  readonly category: string;
  readonly children: ReactNode;
  readonly href?: string | undefined;
  readonly onClick?: VoidFunction | undefined;
  readonly variant: 'primary';
}

export default function Button(props: Readonly<Props>): ReactElement {
  return <DesignSystem props={props} type="button" />;
}