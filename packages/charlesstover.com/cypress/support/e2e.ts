import '@cypress/code-coverage/support';
import ignoreDependencyLogs from '@monorepo-template/ignore-cypress-dependency-logs';
import ignoreResizeObserverUndeliveredNotificationsError from '../../src/test/cypress/utils/ignore-resize-observer-undelivered-notifications-error';

beforeEach(ignoreResizeObserverUndeliveredNotificationsError);

beforeEach((): void => {
  ignoreDependencyLogs([
    'https://cloudflareinsights.com/',
    'https://o592283.ingest.sentry.io/',
    'https://rum.browser-intake-datadoghq.com/',
    'https://session-replay.browser-intake-datadoghq.com/',
  ]);
});
