'use client';

import { type User } from '@sentry/core';
import { type BrowserOptions } from '@sentry/react';
import { useEffect } from 'react';
import useShallowMemo from 'use-shallow-memo';
import useSentrySdk from '../../hooks/use-sentry-sdk.js';

interface Props extends Readonly<BrowserOptions> {
  readonly user?: User | undefined;
}

export default function useSentry({ user, ...browserOptions }: Props): void {
  // Contexts
  const { init, setUser } = useSentrySdk();

  // States
  const memoizedBrowserOptions: BrowserOptions = useShallowMemo(browserOptions);

  // Effects
  useEffect((): void => {
    init(memoizedBrowserOptions);
  }, [init, memoizedBrowserOptions]);

  useEffect((): void => {
    setUser({
      ip_address: '{{auto}}',
      ...user,
    });
  }, [setUser, user]);
}
