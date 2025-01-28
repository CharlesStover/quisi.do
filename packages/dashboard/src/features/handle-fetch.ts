import { FaviconIcoResponse, RobotsTxtResponse } from 'cloudflare-utils';
import { mapToError } from 'fmrs';
import type DashboardFetchHandler from '../dashboard-fetch-handler.js';
import getDatadogAggregateRumEvents from '../datadog-aggregate-rum-events/get-datadog-aggregate-rum-events.js';
import InternalServerErrorResponse from './internal-server-error-response.js';
import OkResponse from './ok-response.js';
import OptionsResponse from './options-response.js';

export default async function handleFetch(
  this: DashboardFetchHandler,
): Promise<Response> {
  if (this.requestMethod === 'OPTIONS') {
    return new OptionsResponse(this.accessControlAllowOrigin);
  }

  if (this.requestPathname === '/favicon.ico') {
    return new FaviconIcoResponse();
  }

  if (this.requestPathname === '/robots.txt') {
    return new RobotsTxtResponse();
  }

  try {
    const [
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
    ] = await Promise.all([getDatadogAggregateRumEvents.call(this)]);

    return new OkResponse(
      {
        cls: [cumulativeLayoutShiftP50, cumulativeLayoutShiftP75],
        dcl: [domContentLoadedP50, domContentLoadedP75],
        domComplete: [domCompleteP50, domCompleteP75],
        errorCount: [errorCountP50, errorCountP75, errorCountP90],
        fcp: [firstContentfulPaintP50, firstContentfulPaintP75],
        fip: [firstInputDelayP50, firstInputDelayP75],
        inp: [interactionToNextPaintP50, interactionToNextPaintP75],
        lcp: [largestContentfulPaintP50, largestContentfulPaintP75],
        loadEvent: [loadEventP50, loadEventP75],
        loadingTime: [loadingTimeP50, loadingTimeP75],
        sessionTimeSpent,
        ttfb: [firstByteP50, firstByteP75],
        viewTimeSpent,
      },
      {
        accessControlAllowOrigin: this.accessControlAllowOrigin,
      },
    );
  } catch (err: unknown) {
    const error: Error = mapToError(err);
    this.logError(error);
    return new InternalServerErrorResponse(this.accessControlAllowOrigin);
  }
}
