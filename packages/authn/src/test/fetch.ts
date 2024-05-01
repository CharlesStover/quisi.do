import type { ErrorCode } from '@quisido/authn-shared';
import handleFetch from '../features/handle-fetch.js';
import createFetchEnv from './create-fetch-env.js';
import createFetchExecutionContext from './create-fetch-execution-context.js';
import createFetchRequest from './create-fetch-request.js';
import expectResponseToRedirectTo from './expect-response-to-redirect-to.js';

/**
 *   This test `fetch` function mimics the behavior of the Clouderflare worker's
 * exported fetch handler, with two important test-specific differences:
 * 1. You supply your own `fetch` implementation (e.g. `jest.fn()`).
 * 2. It returns an abstracted test API, analogous to a Page Object Model.
 */

interface Options {
  readonly env?: unknown;
  readonly fetch?: Fetcher['fetch'] | undefined;
  readonly headers?: Record<string, string> | undefined;
  readonly pathname?: string | undefined;
  readonly search?: Record<string, string> | undefined;
  readonly waitUntil?: (promise: Promise<unknown>) => void;
}

interface Result {
  readonly expectErrorCodeRedirect: (code: ErrorCode) => void;
  readonly expectPublicDataPoint: (datapoint: AnalyticsEngineDataPoint) => void;
  readonly expectResponseHeaderToBe: (key: string, value: string) => void;
  readonly expectResponseToRedirectTo: (to: string) => void;
  readonly expectPrivateDataPoint: (
    datapoint: AnalyticsEngineDataPoint,
  ) => void;
}

const TEST_WRITE_PRIVATE_DATAPOINT = jest.fn();
const TEST_WRITE_PUBLIC_DATAPOINT = jest.fn();

export default async function fetch({
  env,
  fetch: fetchImpl = jest.fn(),
  headers = {},
  pathname = '/',
  search = {},
  waitUntil = jest.fn(),
}: Options): Promise<Result> {
  const response: Response = await handleFetch(
    fetchImpl,
    createFetchRequest({
      headers,
      pathname,
      search,
    }),
    createFetchEnv({
      env,
      writePrivateDataPoint: TEST_WRITE_PRIVATE_DATAPOINT,
      writePublicDataPoint: TEST_WRITE_PUBLIC_DATAPOINT,
    }),
    createFetchExecutionContext(waitUntil),
  );

  return {
    expectErrorCodeRedirect(code: ErrorCode): void {
      const codeStr: string = code.toString();
      expectResponseToRedirectTo(
        response,
        `https://localhost/#authn:error=${codeStr}`,
      );
    },

    expectPrivateDataPoint(datapoint: AnalyticsEngineDataPoint): void {
      expect(TEST_WRITE_PRIVATE_DATAPOINT).toHaveBeenCalledWith(datapoint);
    },

    expectPublicDataPoint(datapoint: AnalyticsEngineDataPoint): void {
      expect(TEST_WRITE_PUBLIC_DATAPOINT).toHaveBeenCalledWith(datapoint);
    },

    expectResponseHeaderToBe(key: string, value: string): void {
      expect(response.headers.get(key)).toBe(value);
    },

    expectResponseToRedirectTo(to: string): void {
      expectResponseToRedirectTo(response, to);
    },
  };
}
