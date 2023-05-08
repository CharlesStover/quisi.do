import FullStory from 'fullstory-react';
import type { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Theme from '../../components/theme';
// import GoogleAnalytics from '../../modules/react-google-analytics';
import type CloudflareAnalytics from '../../types/cloudflare-analytics';
import type RumMetrics from '../../types/rum-metrics';
import type SentryProjectEvent from '../../types/sentry-project-event';
import type UptimeChecks from '../../types/uptime-checks';
import CloudflareInsights from './components/cloudflare-insights';
import CloudWatchRUM from './components/cloudwatch-rum';
import Contexts from './components/contexts';
import Datadog from './components/datadog';
import ErrorBoundary from './components/error-boundary';
import I18nProvider from './components/i18n-provider';
import QueryClientProvider from './components/query-client-provider';
import Routes from './components/routes';
import Sentry from './components/sentry';

/*
The App root component mounts context providers for the whole application.
  Specifically, these providers should allow their values to be dependency-
  injected into unit tests, swapping browser-specific implementations to be
  replaced with Node-friendly alternatives.
*/

interface Props {
  readonly onCloudflareAnalyticsRequest: () => Promise<CloudflareAnalytics>;
  readonly onRumMetricsRequest: () => Promise<RumMetrics>;
  readonly onUptimeChecksRequest: () => Promise<UptimeChecks>;
  readonly onSentryProjectEventsRequest: () => Promise<
    readonly SentryProjectEvent[]
  >;
}

export default function App({
  onCloudflareAnalyticsRequest,
  onRumMetricsRequest,
  onSentryProjectEventsRequest,
  onUptimeChecksRequest,
}: Readonly<Props>): ReactElement {
  return (
    <CloudWatchRUM>
      <ErrorBoundary>
        <CloudflareInsights token="f9703ac5039848f8abd3ab107a208a83" />
        <BrowserRouter>
          <Contexts>
            <Datadog>
              <FullStory orgId="150TVM">
                {/* <GoogleAnalytics trackingId="UA-5966978-4"> */}
                <I18nProvider>
                  <QueryClientProvider>
                    <Sentry>
                      <Theme>
                        <Routes
                          onCloudflareAnalyticsRequest={
                            onCloudflareAnalyticsRequest
                          }
                          onRumMetricsRequest={onRumMetricsRequest}
                          onSentryProjectEventsRequest={
                            onSentryProjectEventsRequest
                          }
                          onUptimeChecksRequest={onUptimeChecksRequest}
                        />
                      </Theme>
                    </Sentry>
                  </QueryClientProvider>
                </I18nProvider>
                {/* </GoogleAnalytics> */}
              </FullStory>
            </Datadog>
          </Contexts>
        </BrowserRouter>
      </ErrorBoundary>
    </CloudWatchRUM>
  );
}
