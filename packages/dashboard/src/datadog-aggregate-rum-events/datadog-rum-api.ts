import { v2 } from '@datadog/datadog-api-client';
import type { RUMWarning } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/index.js';
import {
  MEDIAN,
  PERCENTILE_75,
  PERCENTILE_90,
} from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/models/RUMAggregationFunction.js';
import mapToOptionalNumber from '../utils/map-to-optional-number.js';
import createConfiguration from './create-configuration.js';
import sanitizeStatus from './sanitize-status.js';
import type { Status } from './status.js';

interface AggregateRumEvents {
  readonly cumulativeLayoutShiftP50?: number | undefined;
  readonly cumulativeLayoutShiftP75?: number | undefined;
  readonly domCompleteP50?: number | undefined;
  readonly domCompleteP75?: number | undefined;
  readonly domContentLoadedP50?: number | undefined;
  readonly domContentLoadedP75?: number | undefined;
  readonly elapsed: number;
  readonly errorCountP50?: number | undefined;
  readonly errorCountP75?: number | undefined;
  readonly errorCountP90?: number | undefined;
  readonly firstByteP50?: number | undefined;
  readonly firstByteP75?: number | undefined;
  readonly firstContentfulPaintP50?: number | undefined;
  readonly firstContentfulPaintP75?: number | undefined;
  readonly firstInputDelayP50?: number | undefined;
  readonly firstInputDelayP75?: number | undefined;
  readonly interactionToNextPaintP50?: number | undefined;
  readonly interactionToNextPaintP75?: number | undefined;
  readonly largestContentfulPaintP50?: number | undefined;
  readonly largestContentfulPaintP75?: number | undefined;
  readonly loadEventP50?: number | undefined;
  readonly loadEventP75?: number | undefined;
  readonly loadingTimeP50?: number | undefined;
  readonly loadingTimeP75?: number | undefined;
  readonly requestId: string;
  readonly sessionTimeSpent?: number | undefined;
  readonly status: Status;
  readonly viewTimeSpent?: number | undefined;
  readonly warnings: readonly RUMWarning[];
}

interface Options {
  readonly apiKey: string;
  readonly fetch: Fetcher['fetch'];
  readonly rumReadApplicationKey: string;
}

const DEFAULT_ELAPSED = 0;

export default class DatadogRumApi extends v2.RUMApi {
  public constructor({ apiKey, fetch, rumReadApplicationKey }: Options) {
    super(
      createConfiguration({
        apiKey,
        fetch,
        rumReadApplicationKey,
      }),
    );
  }

  public async getAggregateRumEvents(): Promise<AggregateRumEvents> {
    const [
      {
        data: {
          buckets: [
            {
              computes: {
                c0: sessionTimeSpent,
                c1: cumulativeLayoutShiftP50,
                c2: cumulativeLayoutShiftP75,
                c3: domCompleteP50,
                c4: domCompleteP75,
                c5: domContentLoadedP50,
                c6: domContentLoadedP75,
                c7: errorCountP50,
                c8: errorCountP75,
                c9: errorCountP90,
              } = {},
            } = {},
          ] = [],
        } = {},
        meta = {},
      },
      {
        data: {
          buckets: [
            {
              computes: {
                c0: firstByteP50,
                c1: firstByteP75,
                c2: firstContentfulPaintP50,
                c3: firstContentfulPaintP75,
                c4: firstInputDelayP50,
                c5: firstInputDelayP75,
                c6: interactionToNextPaintP50,
                c7: interactionToNextPaintP75,
                c8: largestContentfulPaintP50,
                c9: largestContentfulPaintP75,
              } = {},
            } = {},
          ] = [],
        } = {},
      },
      {
        data: {
          buckets: [
            {
              computes: {
                c0: loadEventP50,
                c1: loadEventP75,
                c2: loadingTimeP50,
                c3: loadingTimeP75,
                c4: viewTimeSpent,
              } = {},
            } = {},
          ] = [],
        } = {},
      },
    ] = await Promise.all([
      // Computes[0]
      this.aggregateRUMEvents({
        body: {
          compute: [
            {
              aggregation: MEDIAN,
              metric: '@session.time_spent',
            },
            {
              aggregation: MEDIAN,
              metric: '@view.cumulative_layout_shift',
            },
            {
              aggregation: PERCENTILE_75,
              metric: '@view.cumulative_layout_shift',
            },
            {
              aggregation: MEDIAN,
              metric: '@view.dom_complete',
            },
            {
              aggregation: PERCENTILE_75,
              metric: '@view.dom_complete',
            },
            {
              aggregation: MEDIAN,
              metric: '@view.dom_content_loaded',
            },
            {
              aggregation: PERCENTILE_75,
              metric: '@view.dom_content_loaded',
            },
            {
              aggregation: MEDIAN,
              metric: '@view.error.count',
            },
            {
              aggregation: PERCENTILE_75,
              metric: '@view.error.count',
            },
            {
              aggregation: PERCENTILE_90,
              metric: '@view.error.count',
            },
          ],

          filter: {
            from: 'now-2w',
            to: 'now',
          },

          // @ts-expect-error: 'search' does not exist in type 'RUMAggregateRequest'
          search: {
            query:
              '@application.id:e29eb164-e193-4380-b512-ebd70bbfaeb6 @type:view',
          },
        },
      }),

      // Computes[1]
      this.aggregateRUMEvents({
        body: {
          compute: [
            {
              aggregation: MEDIAN,
              metric: '@view.first_byte',
            },
            {
              aggregation: PERCENTILE_75,
              metric: '@view.first_byte',
            },
            {
              aggregation: MEDIAN,
              metric: '@view.first_contentful_paint',
            },
            {
              aggregation: PERCENTILE_75,
              metric: '@view.first_contentful_paint',
            },
            {
              aggregation: MEDIAN,
              metric: '@view.first_input_delay',
            },
            {
              aggregation: PERCENTILE_75,
              metric: '@view.first_input_delay',
            },
            {
              aggregation: MEDIAN,
              metric: '@view.interaction_to_next_paint',
            },
            {
              aggregation: PERCENTILE_75,
              metric: '@view.interaction_to_next_paint',
            },
            {
              aggregation: MEDIAN,
              metric: '@view.largest_contentful_paint',
            },
            {
              aggregation: PERCENTILE_75,
              metric: '@view.largest_contentful_paint',
            },
          ],

          filter: {
            from: 'now-2w',
            to: 'now',
          },

          // @ts-expect-error: 'search' does not exist in type 'RUMAggregateRequest'
          search: {
            query:
              '@application.id:e29eb164-e193-4380-b512-ebd70bbfaeb6 @type:view',
          },
        },
      }),

      // Computes[2]
      this.aggregateRUMEvents({
        body: {
          compute: [
            {
              aggregation: MEDIAN,
              metric: '@view.load_event',
            },
            {
              aggregation: PERCENTILE_75,
              metric: '@view.load_event',
            },
            {
              aggregation: MEDIAN,
              metric: '@view.loading_time',
            },
            {
              aggregation: PERCENTILE_75,
              metric: '@view.loading_time',
            },
            {
              aggregation: MEDIAN,
              metric: '@view.time_spent',
            },
          ],

          filter: {
            from: 'now-2w',
            to: 'now',
          },

          // @ts-expect-error: 'search' does not exist in type 'RUMAggregateRequest'
          search: {
            query:
              '@application.id:e29eb164-e193-4380-b512-ebd70bbfaeb6 @type:view',
          },
        },
      }),
    ]);

    return {
      cumulativeLayoutShiftP50: mapToOptionalNumber(cumulativeLayoutShiftP50),
      cumulativeLayoutShiftP75: mapToOptionalNumber(cumulativeLayoutShiftP75),
      domCompleteP50: mapToOptionalNumber(domCompleteP50),
      domCompleteP75: mapToOptionalNumber(domCompleteP75),
      domContentLoadedP50: mapToOptionalNumber(domContentLoadedP50),
      domContentLoadedP75: mapToOptionalNumber(domContentLoadedP75),
      elapsed: meta.elapsed ?? DEFAULT_ELAPSED,
      errorCountP50: mapToOptionalNumber(errorCountP50),
      errorCountP75: mapToOptionalNumber(errorCountP75),
      errorCountP90: mapToOptionalNumber(errorCountP90),
      firstByteP50: mapToOptionalNumber(firstByteP50),
      firstByteP75: mapToOptionalNumber(firstByteP75),
      firstContentfulPaintP50: mapToOptionalNumber(firstContentfulPaintP50),
      firstContentfulPaintP75: mapToOptionalNumber(firstContentfulPaintP75),
      firstInputDelayP50: mapToOptionalNumber(firstInputDelayP50),
      firstInputDelayP75: mapToOptionalNumber(firstInputDelayP75),
      interactionToNextPaintP50: mapToOptionalNumber(interactionToNextPaintP50),
      interactionToNextPaintP75: mapToOptionalNumber(interactionToNextPaintP75),
      largestContentfulPaintP50: mapToOptionalNumber(largestContentfulPaintP50),
      largestContentfulPaintP75: mapToOptionalNumber(largestContentfulPaintP75),
      loadEventP50: mapToOptionalNumber(loadEventP50),
      loadEventP75: mapToOptionalNumber(loadEventP75),
      loadingTimeP50: mapToOptionalNumber(loadingTimeP50),
      loadingTimeP75: mapToOptionalNumber(loadingTimeP75),
      requestId: meta.requestId ?? '',
      sessionTimeSpent: mapToOptionalNumber(sessionTimeSpent),
      status: sanitizeStatus(meta.status),
      viewTimeSpent: mapToOptionalNumber(viewTimeSpent),
      warnings: meta.warnings ?? [],
    };
  }
}
