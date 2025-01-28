'use client';

import useDatadog from '../hooks/use-datadog.js';
import useGoogleAnalytics from '../hooks/use-google-analytics.js';

export default function Analytics(): null {
  useDatadog();
  useGoogleAnalytics();

  return null;
}
