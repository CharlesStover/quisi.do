import { type Config } from 'lighthouse';

const lightghouseConfig: Config = {
  extends: 'lighthouse:default',
  settings: {
    /*
     * BudgetPath: 'lighthouse.budget.json',
     * chromeFlags: "--headless",
     * enableErrorReporting: true,
     */
    locale: 'en-US',
    /*
     * Output: ['html', 'json'],
     * outputPath: "lighthouse",
     * preset: "experimental",
     * saveAssets: true,
     * verbose: false,
     */

    blockedUrlPatterns: [
      'https://analytics.google.com/*',
      'https://api.honeycomb.io/*',
      'https://browser-intake-datadoghq.com/*',
      'https://cdn.logr-ingest.com/*',
      'https://challenges.cloudflare.com/*',
      'https://clarity.ms/*',
      'https://cloudflareinsights.com/*',
      'https://dataplane.rum.us-west-2.amazonaws.com/*',
      'https://edge.fullstory.com/*',
      'https://o592283.ingest.sentry.io/*',
      'https://r.logr-ingest.com/*',
      'https://rs.fullstory.com/*',
      'https://rum.browser-intake-datadoghq.com/*',
      'https://session-replay.browser-intake-datadoghq.com/*',
      'https://static.cloudflareinsights.com/*',
      'https://stats.g.doubleclick.net/*',
      'https://t.clarity.ms/*',
      'https://www.clarity.ms/*',
      'https://www.google.com/ads/*',
      'https://www.googleadservices.com/*',
      'https://www.google-analytics.com/*',
      'https://www.googletagmanager.com/*',

      // Services have an invalid local certificates.
      'https://localhost:5882/*',
      'https://localhost:6586/*',
      'https://localhost:9778/*',
    ],
  },
};

export default lightghouseConfig;
