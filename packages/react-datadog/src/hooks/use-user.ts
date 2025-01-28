'use client';

import type { datadogRum } from '@datadog/browser-rum';
import { isUndefined } from 'fmrs';
import { useEffect } from 'react';
import useShallowMemo from 'use-shallow-memo';
import type User from '../types/user.js';
import useDatadogRum from './use-datadog-rum.js';

const DEFAULT_USER: Readonly<User> = Object.freeze({});

export default function useUser(user: Readonly<User> = DEFAULT_USER): void {
  // Contexts
  const rum: typeof datadogRum = useDatadogRum();

  // States
  const userMemo: User = useShallowMemo(user);

  // Effects
  useEffect((): VoidFunction | undefined => {
    if (Object.values(userMemo).every(isUndefined)) {
      return;
    }

    rum.setUser(userMemo);
    return (): void => {
      rum.clearUser();
    };
  }, [rum, userMemo]);
}
