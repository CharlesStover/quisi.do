import type { RUMResponseStatus } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/index.js';
import type { Status } from './status.js';

export default function sanitizeStatus(
  status: RUMResponseStatus | undefined,
): Status {
  if (typeof status === 'undefined') {
    return 'unknown';
  }

  if (typeof status === 'object') {
    return 'unparsed';
  }

  return status;
}
