import { MetricName } from '../constants/metric-name.js';
import type DashboardFetchHandler from '../dashboard-fetch-handler.js';
import type { Status } from './status.js';

interface Options {
  readonly elapsed: number;
  readonly requestId: string;
  readonly status: Status;
}

export default function emitMissingMetrics(
  this: DashboardFetchHandler,
  values: Partial<Record<string, number>>,
  { elapsed, requestId, status }: Options,
): void {
  for (const [key, value] of Object.entries(values)) {
    if (typeof value !== 'undefined') {
      continue;
    }

    this.emitPrivateMetric(MetricName.MissingDatadogRumMetric, {
      elapsed,
      key,
      requestId,
      status,
    });

    this.emitPublicMetric(MetricName.MissingDatadogRumMetric, {
      elapsed,
      key,
      status,
    });
  }
}
