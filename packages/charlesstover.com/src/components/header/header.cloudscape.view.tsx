import Header from '@cloudscape-design/components/header';
import type { ReactElement } from 'react';
import type Props from './types/props';

export default function CloudscapeHeader({
  actions,
  children,
}: Readonly<Props>): ReactElement {
  return <Header actions={actions}>{children}</Header>;
}
