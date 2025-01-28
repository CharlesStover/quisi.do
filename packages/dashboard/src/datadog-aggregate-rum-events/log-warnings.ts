import type { RUMWarning } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/index.js';
import type DashboardFetchHandler from '../dashboard-fetch-handler.js';

const DEFAULT_WARNING_CODE = 0;

export default function logWarnings(
  this: DashboardFetchHandler,
  warnings: readonly RUMWarning[],
): void {
  for (const {
    code = DEFAULT_WARNING_CODE,
    detail = 'No details available',
    title = 'Unknown warning',
  } of warnings) {
    this.logError(
      new Error(`Datadog warning: ${title} (code: ${code}, detail: ${detail})`),
    );
  }
}
