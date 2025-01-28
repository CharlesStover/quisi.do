import type { MemoryHistory } from 'history';
import {
  AppRouterContext,
  type AppRouterInstance,
  type PrefetchOptions,
} from 'next/dist/shared/lib/app-router-context.shared-runtime.js';
import { type PropsWithChildren, type ReactElement, useMemo } from 'react';
import noop from '../utils/noop.js';

interface Props {
  readonly history: MemoryHistory;
  readonly prefetch?:
    | ((href: string, options?: PrefetchOptions) => void)
    | undefined;
}

export default function MockAppRouter({
  children,
  history,
  prefetch = noop,
}: PropsWithChildren<Props>): ReactElement {
  const value: AppRouterInstance = useMemo(
    (): AppRouterInstance => ({
      ...history,
      prefetch,
      refresh: noop,
    }),
    [history, prefetch],
  );

  return (
    <AppRouterContext.Provider value={value}>
      {children}
    </AppRouterContext.Provider>
  );
}
