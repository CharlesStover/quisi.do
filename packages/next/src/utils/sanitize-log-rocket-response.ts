import { WHOAMI } from '../constants/whoami.js';
import type {
  LogRocketRequest,
  LogRocketResponse,
} from '../types/log-rocket.js';

/**
 *   Don't risk logging the response of an unknown request. It may contain
 * sensitive information,
 */

export default function sanitizeLogRocketResponse(
  request: LogRocketRequest | undefined,
  response: LogRocketResponse,
): LogRocketResponse | null {
  if (typeof request === 'undefined') {
    return null;
  }

  if (request.url === WHOAMI) {
    return null;
  }

  return response;
}
