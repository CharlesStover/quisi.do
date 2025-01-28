import type { ReactElement, ReactNode } from 'react';

export interface Props {
  readonly children: ReactNode;
  readonly className?: string | undefined;
  readonly color?: 'inherit' | 'label' | 'secondary-body' | undefined;
  readonly element?: 'h2' | 'p' | undefined;
  readonly size?:
    | 'large'
    | 'medium-heading'
    | 'medium'
    | 'small-heading'
    | 'small'
    | undefined;
}

export default function QuisiSpan({
  children,
  className,
}: Props): ReactElement {
  return <span className={className}>{children}</span>;
}
