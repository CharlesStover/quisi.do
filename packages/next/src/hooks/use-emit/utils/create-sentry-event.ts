import { type Event } from '@sentry/core';
import SENTRY_EVENT from '../constants/sentry-event.js';
import mapDimensionsToFingerprints from './map-dimensions-to-fingerprints.js';
import mapNumberToSentryEventId from './map-number-to-sentry-event-id.js';

interface Options {
  readonly dimensions: Record<string, unknown>;
  readonly hostname: string;
  readonly name: string;
  readonly pathname: string;
}

export default function createSentryEvent({
  dimensions,
  hostname,
  name,
  pathname,
}: Readonly<Options>): Event {
  const now: number = Date.now();

  return {
    ...SENTRY_EVENT,
    event_id: mapNumberToSentryEventId(now),
    extra: dimensions,
    fingerprint: [name, ...mapDimensionsToFingerprints(dimensions)],
    message: name,
    server_name: hostname,
    timestamp: now,
    transaction: pathname,

    contexts: {
      ...SENTRY_EVENT.contexts,
      device: {
        ...SENTRY_EVENT.contexts.device,
        name: window.navigator.userAgent,
      },
    },
  };
}
