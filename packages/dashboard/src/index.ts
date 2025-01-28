/// <reference types="@cloudflare/workers-types" />

import { ExportedHandler } from '@quisido/worker';
import DashboardFetchHandler from './dashboard-fetch-handler.js';
import handleError from './handle-error.js';
import handleLog from './handle-log.js';
import handleMetric from './handle-metric.js';

export default new ExportedHandler({
  FetchHandler: DashboardFetchHandler,
  console,
  fetch,
  onError: handleError,
  onLog: handleLog,
  onMetric: handleMetric,
});
