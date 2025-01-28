import { mapToError } from 'fmrs';
import { MetricName } from '../constants/metric-name.js';
import {
  MILLISECONDS_PER_MINUTE,
  SECONDS_PER_MINUTE,
} from '../constants/time.js';
import type DashboardFetchHandler from '../dashboard-fetch-handler.js';
import DatadogRumApi from './datadog-rum-api.js';
import emitMissingMetrics from './emit-missing-metrics.js';
import logWarnings from './log-warnings.js';
import mapNsToMs from './map-ns-to-ms.js';
import round from './round.js';

interface DatadogAggregateRumEvents {
  readonly cumulativeLayoutShiftP50?: number | undefined;
  readonly cumulativeLayoutShiftP75?: number | undefined;
  readonly domCompleteP50?: number | undefined;
  readonly domCompleteP75?: number | undefined;
  readonly domContentLoadedP50?: number | undefined;
  readonly domContentLoadedP75?: number | undefined;
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
  readonly sessionTimeSpent?: number | undefined;
  readonly viewTimeSpent?: number | undefined;
}

const CACHE_EXPIRY_MINUTES = 5;
const CUMULATIVE_LAYOUT_SHIFT_DECIMALS = 4;

const roundCls = (value: number | undefined): number | undefined =>
  round(value, CUMULATIVE_LAYOUT_SHIFT_DECIMALS);

export default async function getDatadogAggregateRumEvents(
  this: DashboardFetchHandler,
): Promise<DatadogAggregateRumEvents> {
  const cache: R2Bucket = this.getR2Bucket('CACHE');
  const cacheValue: R2ObjectBody | null = await cache.get(
    '/datadog-aggregate-rum-events',
  );

  if (cacheValue === null) {
    this.emitPublicMetric(MetricName.DatadogAggregateRumEventsUncached);
  } else {
    const { httpMetadata } = cacheValue;
    if (typeof httpMetadata === 'undefined') {
      this.emitPublicMetric(
        MetricName.MissingDatadogAggregateRumEventsCacheMetadata,
      );
    } else {
      const { cacheExpiry } = httpMetadata;
      if (typeof cacheExpiry === 'undefined') {
        this.emitPublicMetric(
          MetricName.MissingDatadogAggregateRumEventsCacheExpiry,
        );
      } else if (cacheExpiry.getTime() < this.now()) {
        this.emitPublicMetric(MetricName.ExpiredDatadogAggregateRumEvents);
      } else {
        this.emitPublicMetric(MetricName.DatadogAggregateRumEventsCached);
        return await cacheValue.json();
      }
    }
  }

  const datadog = new DatadogRumApi({
    apiKey: this.datadogApiKey,
    fetch: this.fetch.bind(this),
    rumReadApplicationKey: this.datadogRumReadApplicationKey,
  });

  try {
    const {
      cumulativeLayoutShiftP50,
      cumulativeLayoutShiftP75,
      domCompleteP50,
      domCompleteP75,
      domContentLoadedP50,
      domContentLoadedP75,
      elapsed,
      errorCountP50,
      errorCountP75,
      errorCountP90,
      firstByteP50,
      firstByteP75,
      firstContentfulPaintP50,
      firstContentfulPaintP75,
      firstInputDelayP50,
      firstInputDelayP75,
      interactionToNextPaintP50,
      interactionToNextPaintP75,
      largestContentfulPaintP50,
      largestContentfulPaintP75,
      loadEventP50,
      loadEventP75,
      loadingTimeP50,
      loadingTimeP75,
      requestId,
      sessionTimeSpent,
      status,
      viewTimeSpent,
      warnings,
    } = await datadog.getAggregateRumEvents();
    logWarnings.call(this, warnings);
    emitMissingMetrics.call(
      this,
      {
        cumulativeLayoutShiftP50,
        cumulativeLayoutShiftP75,
        domCompleteP50,
        domCompleteP75,
        domContentLoadedP50,
        domContentLoadedP75,
        errorCountP50,
        errorCountP75,
        errorCountP90,
        firstByteP50,
        firstByteP75,
        firstContentfulPaintP50,
        firstContentfulPaintP75,
        firstInputDelayP50,
        firstInputDelayP75,
        interactionToNextPaintP50,
        interactionToNextPaintP75,
        largestContentfulPaintP50,
        largestContentfulPaintP75,
        loadEventP50,
        loadEventP75,
        loadingTimeP50,
        loadingTimeP75,
        sessionTimeSpent,
        viewTimeSpent,
      },
      {
        elapsed,
        requestId,
        status,
      },
    );

    const value: DatadogAggregateRumEvents = {
      cumulativeLayoutShiftP50: roundCls(cumulativeLayoutShiftP50),
      cumulativeLayoutShiftP75: roundCls(cumulativeLayoutShiftP75),
      domCompleteP50: mapNsToMs(domCompleteP50),
      domCompleteP75: mapNsToMs(domCompleteP75),
      domContentLoadedP50: mapNsToMs(domContentLoadedP50),
      domContentLoadedP75: mapNsToMs(domContentLoadedP75),
      errorCountP50,
      errorCountP75,
      errorCountP90,
      firstByteP50: mapNsToMs(firstByteP50),
      firstByteP75: mapNsToMs(firstByteP75),
      firstContentfulPaintP50: mapNsToMs(firstContentfulPaintP50),
      firstContentfulPaintP75: mapNsToMs(firstContentfulPaintP75),
      firstInputDelayP50: mapNsToMs(firstInputDelayP50),
      firstInputDelayP75: mapNsToMs(firstInputDelayP75),
      interactionToNextPaintP50: mapNsToMs(interactionToNextPaintP50),
      interactionToNextPaintP75: mapNsToMs(interactionToNextPaintP75),
      largestContentfulPaintP50: mapNsToMs(largestContentfulPaintP50),
      largestContentfulPaintP75: mapNsToMs(largestContentfulPaintP75),
      loadEventP50: mapNsToMs(loadEventP50),
      loadEventP75: mapNsToMs(loadEventP75),
      loadingTimeP50: mapNsToMs(loadingTimeP50),
      loadingTimeP75: mapNsToMs(loadingTimeP75),
      sessionTimeSpent: mapNsToMs(sessionTimeSpent),
      viewTimeSpent: mapNsToMs(viewTimeSpent),
    };

    const cacheExpiry = new Date(
      this.now() + CACHE_EXPIRY_MINUTES * MILLISECONDS_PER_MINUTE,
    );
    this.affect(
      cache.put('/datadog-aggregate-rum-events', JSON.stringify(value), {
        storageClass: 'Standard',

        httpMetadata: {
          cacheControl: `immutable, max-age=${CACHE_EXPIRY_MINUTES * SECONDS_PER_MINUTE}, public`,
          cacheExpiry,
          contentType: 'application/json',
        },
      }),
    );

    return value;
  } catch (err: unknown) {
    const error: Error = mapToError(err);
    this.logError(error);
    return {};
  }
}
