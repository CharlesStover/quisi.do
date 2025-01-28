import { client } from '@datadog/datadog-api-client';

interface Options {
  readonly apiKey: string;
  readonly fetch: Fetcher['fetch'];
  readonly rumReadApplicationKey: string;
}

export default function createConfiguration({
  apiKey,
  fetch,
  rumReadApplicationKey,
}: Options): client.Configuration {
  return client.createConfiguration({
    debug: true,
    enableRetry: true,
    fetch,

    authMethods: {
      apiKeyAuth: apiKey,
      appKeyAuth: rumReadApplicationKey,
    },

    httpConfig: {
      compress: true,
    },
  });
}
