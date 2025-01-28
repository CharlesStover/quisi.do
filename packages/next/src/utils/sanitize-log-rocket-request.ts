import type { LogRocketRequest } from '../types/log-rocket.js';

export default function sanitizeLogRocketRequest(
  request: LogRocketRequest,
): LogRocketRequest | null {
  const headers: Partial<Record<string, string>> = { ...request.headers };
  delete headers['Cookie'];
  delete headers['cookie'];

  return {
    ...request,
    headers,
  };
}
