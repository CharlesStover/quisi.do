import { Fragment, type ReactElement, type ReactNode } from 'react';

export default function mapNodeToFragment(
  node: ReactNode,
  index: number,
): ReactElement {
  return <Fragment key={index}>{node}</Fragment>;
}
