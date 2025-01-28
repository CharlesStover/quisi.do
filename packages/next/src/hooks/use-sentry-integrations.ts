import {
  browserProfilingIntegration,
  replayIntegration,
} from '@sentry/browser';
import type { Integration } from '@sentry/core';
import { fullStoryIntegration } from '@sentry/fullstory';
import { useFullstory, type FSApi } from 'fullstory-react';
import { useMemo } from 'react';

const REPLAY_INTEGRATION = replayIntegration({
  blockAllMedia: false,
  maskAllText: false,
});

export default function useSentryIntegrations(
  sentryOrg: string,
): Integration[] {
  const fullstory: FSApi = useFullstory();

  return useMemo(
    (): Integration[] => [
      browserProfilingIntegration(),

      fullStoryIntegration(sentryOrg, {
        client: fullstory,
      }),

      REPLAY_INTEGRATION,
    ],
    [fullstory, sentryOrg],
  );
}
