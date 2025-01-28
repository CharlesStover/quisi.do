'use client';

import useReactDatadog, { type Props } from 'react-datadog';
import { GITHUB_SHA } from '../constants/github-sha.js';
import validateString from '../utils/validate-string.js';

const APPLICATION_ID: string = validateString(process.env['DD_APPLICATION_ID']);
const CLIENT_TOKEN: string = validateString(process.env['DD_CLIENT_TOKEN']);
const EXPERIMENTAL_FEATURES: string[] = ['feature_flags'];

const PROPS: Required<
  Omit<
    Props,
    | 'actionNameAttribute'
    | 'allowedTracingUrls'
    | 'beforeSend'
    | 'datacenter'
    | 'internalAnalyticsSubdomain'
    | 'proxy'
    | 'remoteConfigurationId'
    | 'replica'
    | 'subdomain'
    | 'trackingConsent'
    | 'useCrossSiteSessionCookie'
    | 'user'
    | 'workerUrl'
  >
> = {
  allowFallbackToLocalStorage: true,
  allowUntrustedEvents: true,
  applicationId: APPLICATION_ID,
  clientToken: CLIENT_TOKEN,
  compressIntakeRequests: true,
  defaultPrivacyLevel: 'mask-user-input',
  enableExperimentalFeatures: EXPERIMENTAL_FEATURES,
  enablePrivacyForActionName: true,
  enabled: true,
  env: process.env.NODE_ENV,
  plugins: [],
  service: 'quisi.do',
  sessionReplayRecording: true,
  sessionReplaySampleRate: 100,
  sessionSampleRate: 100,
  silentMultipleInit: true,
  site: 'datadoghq.com',
  startSessionReplayRecordingManually: false,
  storeContextsAcrossPages: true,
  telemetryConfigurationSampleRate: 100,
  telemetrySampleRate: 100,
  telemetryUsageSampleRate: 100,
  traceContextInjection: 'all',
  traceSampleRate: 100,
  trackLongTasks: true,
  trackResources: true,
  trackSessionAcrossSubdomains: true,
  trackUserInteractions: true,
  trackViewsManually: false,
  usePartitionedCrossSiteSessionCookie: true,
  useSecureSessionCookie: true,
  version: GITHUB_SHA ?? 'unknown',

  excludedActivityUrls: [
    // Content Security Policy connect-src
    /^https:\/\/(?:[a-z\d]+\.clarity\.ms|analytics\.google\.com|cloudflareinsights\.com|cognito-identity\.[a-z\d-]+\.amazonaws\.com|dataplane\.rum\.[a-z\d-]+\.amazonaws\.com|edge\.fullstory\.com|[a-z\d]+\.ingest\.sentry\.io|r\.logr-ingest\.com|r\.lrkt-in\.com|region\d+\.analytics\.google\.com|rs\.fullstory\.com|stats\.g\.doubleclick\.net|sts\.[a-z\d-]+\.amazonaws\.com|www\.google-analytics\.com)\//u,

    // Content Security Policy frame-src
    /^https:\/\/(?:td\.td\.doubleclick\.net)\//u,

    // Content Security Policy img-src
    /^https:\/\/(?:api-js\.mixpanel\.com|c\.bing\.com|c\.clarity\.ms|www\.google\.[a-z]+|www\.google\.co\.[a-z]+|www\.google\.com\.[a-z]+|www\.googletagmanager\.com)\//u,

    // Content Security Policy script-src-elem
    /^https:\/\/(?:ajax\.cloudflare\.com|cdn\.logr-ingest\.com|cdn\.lrkt-in\.com|edge\.fullstory\.com|static\.cloudflareinsights\.com|www\.clarity\.ms)\//u,
    'https://quisi.do/cdn-cgi/speculation',

    // Content Security Policy style-src-elem
    'https://fonts.googleapis.com/css2',
  ],

  // Technical debt: trackingConsent: 'not-granted',
};

export default function useDatadog(): void {
  useReactDatadog(PROPS);
}
