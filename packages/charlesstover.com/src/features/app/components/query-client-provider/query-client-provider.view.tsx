import { QueryClientProvider as ReactQueryClientProvider } from '@tanstack/react-query';
import type { ReactElement, ReactNode } from 'react';
import QUERY_CLIENT from '../../../../constants/query-client';

interface Props {
  readonly children: ReactNode;
}

export default function QueryClientProvider({
  children,
}: Readonly<Props>): ReactElement {
  return (
    <ReactQueryClientProvider client={QUERY_CLIENT}>
      {children}
    </ReactQueryClientProvider>
  );
}
