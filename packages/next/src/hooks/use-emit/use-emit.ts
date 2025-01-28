import { type EventHint, type Event as SentryEvent } from '@sentry/core';
import { useRecordEvent } from 'aws-rum-react';
import { useFullstory, type FSApi } from 'fullstory-react';
import mixpanelBrowser from 'mixpanel-browser';
import { useDatadogRum } from 'react-datadog';
import { useSentrySdk } from 'sentry-react';
import { useHostname } from '../../contexts/hostname.js';
import EMPTY_OBJECT from '../../modules/react-google-analytics/constants/empty-object.js';
import type { Dimensions } from '../../types/dimensions.js';
import mapObjectToEntries from '../../utils/map-object-to-entries.js';
import zarazTrack from '../../utils/zaraz-track.js';
import useEffectEvent from '../use-effect-event.js';
import useLogRocket from '../use-log-rocket.js';
import usePathname from '../use-pathname.js';
import createSentryEvent from './utils/create-sentry-event.js';

interface CaptureSentryEventOptions {
  readonly captureEvent: (event: SentryEvent, hint?: EventHint) => string;
  readonly hostname: string;
  readonly pathname: string;
}

type EventEmitter = (name: string, dimensions?: Readonly<Dimensions>) => void;

const captureSentryEvent = (
  name: string,
  dimensions: Readonly<Dimensions>,
  { captureEvent, hostname, pathname }: CaptureSentryEventOptions,
): void => {
  const sentryEvent: SentryEvent = createSentryEvent({
    dimensions,
    hostname,
    name,
    pathname,
  });

  captureEvent(sentryEvent, {
    mechanism: {
      type: 'generic',
    },
  });
};

const removeNullValues = <K extends number | string | symbol, V>(
  record: Record<K, V | null | undefined>,
): Record<K, V | undefined> => {
  const newRecord: Record<K, V | undefined> = {} as Record<K, V | undefined>;
  for (const [key, value] of mapObjectToEntries(record)) {
    if (value === null) {
      newRecord[key] = undefined;
      continue;
    }
    newRecord[key] = value;
  }
  return newRecord;
};

const safeMixpanelBrowserTrack = (
  name: string,
  dimensions: Readonly<Dimensions>,
): void => {
  try {
    mixpanelBrowser.track(name, dimensions);
  } catch (_err: unknown) {
    /**
     * Mixpanel has not finished loading yet.
     * Cannot read properties of undefined (reading '_event_is_disabled')
     */
  }
};

/**
 * Common e-commerce events:
 * https://developers.cloudflare.com/zaraz/web-api/ecommerce/#list-of-supported-events
 * https://developers.cloudflare.com/zaraz/web-api/ecommerce/#list-of-supported-parameters
 *   Product List Viewed
 *   Products Searched
 *   Product Clicked
 *   Product Added
 *   Product Added to Wishlist
 *   Product Removed
 *   Product Viewed
 *   Cart Viewed
 *   Checkout Started
 *   Checkout Step Viewed
 *   Checkout Step Completed
 *   Payment Info Entered
 *   Order Completed
 *   Order Updated
 *   Order Refunded
 *   Order Cancelled
 *   Clicked Promotion
 *   Viewed Promotion
 *   Shipping Info Entered
 */
export default function useEmit(): EventEmitter {
  // Context
  const fullstory: FSApi = useFullstory();
  const hostname: string = useHostname();
  const pathname: string = usePathname();
  const recordEvent = useRecordEvent();
  const LogRocket = useLogRocket();
  const { captureEvent } = useSentrySdk();
  const { addAction } = useDatadogRum();

  // States
  return useEffectEvent(
    (name: string, dimensions: Readonly<Dimensions> = EMPTY_OBJECT): void => {
      // CloudWatch RUM
      recordEvent(name, dimensions);

      // Datadog
      addAction(name, dimensions);

      // Fullstory
      fullstory('trackEvent', {
        name,
        properties: dimensions,
      });

      // LogRocket
      LogRocket.track(name, removeNullValues(dimensions));

      // Mixpanel
      safeMixpanelBrowserTrack(name, dimensions);

      // Sentry
      captureSentryEvent(name, dimensions, {
        captureEvent,
        hostname,
        pathname,
      });

      // Zaraz
      zarazTrack(name, dimensions);
    },
  );
}
