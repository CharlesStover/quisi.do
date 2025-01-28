import { FetchHandler, type MetricDimensions } from '@quisido/worker';
import { isString } from 'fmrs';
import { PUBLIC } from './constants/metric-dimensions.js';
import type { MetricName } from './constants/metric-name.js';
import handleFetch from './features/handle-fetch.js';

export default class DashboardFetchHandler extends FetchHandler {
  public constructor() {
    super(handleFetch);
  }

  public get accessControlAllowOrigin(): string {
    return this.validateBinding('CORS_ORIGIN', isString);
  }

  public get datadogApiKey(): string {
    return this.validateBinding('DATADOG_API_KEY', isString);
  }

  public get datadogRumReadApplicationKey(): string {
    return this.validateBinding('DATADOG_RUM_READ_APPLICATION_KEY', isString);
  }

  public emitPrivateMetric(
    name: MetricName,
    dimensions?: MetricDimensions,
  ): void {
    this.emitMetric(name, {
      ...dimensions,
      [PUBLIC]: false,
    });
  }

  public emitPublicMetric(
    name: MetricName,
    dimensions?: MetricDimensions,
  ): void {
    this.emitMetric(name, {
      ...dimensions,
      [PUBLIC]: true,
    });
  }
}
