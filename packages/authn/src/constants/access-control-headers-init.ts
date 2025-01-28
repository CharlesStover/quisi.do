import { SECONDS_PER_MINUTE } from './time.js';

const MAX_AGE_MINUTES = 10;

export const ACCESS_CONTROL_HEADERS_INIT: HeadersInit = {
  'access-control-allow-credentials': 'true',
  'access-control-allow-headers': 'Baggage, Sentry-Trace',
  'access-control-max-age': (MAX_AGE_MINUTES * SECONDS_PER_MINUTE).toString(),
};
