'use client';

import type { RumInitConfiguration } from '@datadog/browser-rum';
import useShallowMemo from 'use-shallow-memo';
import type User from '../types/user.js';
import useInit from './use-init.js';
import useSessionReplayRecording from './use-session-replay-recording.js';
import useUser from './use-user.js';

export interface Props extends RumInitConfiguration {
  readonly enabled?: boolean | undefined;
  readonly sessionReplayRecording?: boolean | undefined;
  readonly user?: User | undefined;
}

export default function useDatadog({
  enabled = true,
  sessionReplayRecording = true,
  silentMultipleInit = true,
  site = 'datadoghq.com',
  user,
  ...rumInitConfiguration
}: Props): void {
  useInit({
    enabled,
    rumInitConfiguration: useShallowMemo({
      ...rumInitConfiguration,
      silentMultipleInit,
      site,
    }),
  });

  useSessionReplayRecording({
    enabled,
    sessionReplayRecording,
  });

  useUser(user);
}
