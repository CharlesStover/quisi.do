/// <reference types="@cloudflare/workers-types" />
import {
  ExportedHandler,
  type FetchHandler as IFetchHandler,
} from '@quisido/worker';
import { isAnalyticsEngineDataset } from 'cloudflare-utils';
import { is } from 'fmrs';
import { assert, expect, vi, type Mock } from 'vitest';
import isEqual from './is-equal.js';
import mapMockedResponseToUrl from './map-mocked-response-to-url.js';
import mapRequestInfoToString from './map-request-info-to-string.js';
import noop from './noop.js';
import TestResponse from './test-response.js';

interface Options {
  readonly FetchHandler: new () => IFetchHandler;
  readonly env?: Readonly<Record<string, unknown>> | undefined;
  readonly now?: (() => number) | undefined;
  readonly onError?: ((error: Error) => void) | undefined;
  readonly onLog?: ((message: string) => void) | undefined;

  readonly onMetric?:
    | ((
        name: string,
        dimensions: Record<string, boolean | number | string>,
      ) => void)
    | undefined;
}

const SINGLE = 1;
const TEST_PASS_THROUGH_ON_EXCEPTION = vi.fn();

export default class TestExportedHandler {
  readonly #consoleError: Console['error'] = vi.fn();
  readonly #consoleLog: Console['log'] = vi.fn();
  readonly #env: Readonly<Record<string, unknown>>;
  readonly #exportedHandler: ExportedHandler;
  readonly #fetchErrors: Error[] = [];
  readonly #mockedResponses: (readonly [RequestInfo, unknown, Response])[] = [];
  #now: () => number = Date.now.bind(Date);

  public constructor({
    FetchHandler,
    env = {},
    now = this.getNow.bind(this),
    onError = noop,
    onLog = noop,
    onMetric = noop,
  }: Options) {
    this.#env = env;
    this.expectMetric = this.expectMetric.bind(this);
    this.fetch = this.fetch.bind(this);
    this.getNow = this.getNow.bind(this);
    this.mockResponse = this.mockResponse.bind(this);
    this.setNow = this.setNow.bind(this);

    this.expectNotToHaveWrittenDataPoint =
      this.expectNotToHaveWrittenDataPoint.bind(this);

    this.expectToHaveWrittenDataPoint =
      this.expectToHaveWrittenDataPoint.bind(this);

    this.#handleMetric.mockImplementation(onMetric);
    this.#exportedHandler = new ExportedHandler({
      FetchHandler,
      fetch: this.#mockedFetch,
      now,
      onError,
      onLog,
      onMetric: this.#handleMetric,

      console: {
        ...console,
        error: this.#consoleError,
        log: this.#consoleLog,
      },
    });
  }

  public expectMetric(
    name: string,
    dimensions: Record<string, boolean | number | string>,
  ): void {
    expect(this.#handleMetric).toHaveBeenCalledWith(name, dimensions);
  }

  public expectNotToHaveWrittenDataPoint(
    env: string,
    dataPoint: AnalyticsEngineDataPoint,
  ): void {
    const dataset: unknown = this.#env[env];
    assert(isAnalyticsEngineDataset(dataset));
    expect(dataset.writeDataPoint).not.toHaveBeenCalledWith(dataPoint);
  }

  public expectToHaveWrittenDataPoint(
    env: string,
    dataPoint: AnalyticsEngineDataPoint,
  ): void {
    const dataset: unknown = this.#env[env];
    assert(isAnalyticsEngineDataset(dataset));
    expect(dataset.writeDataPoint).toHaveBeenCalledWith(dataPoint);
  }

  public async fetch(
    input: string,
    init?: RequestInit<IncomingRequestCfProperties>,
  ): Promise<TestResponse> {
    const request = new Request<unknown, IncomingRequestCfProperties>(
      `https://localhost:1234${input}`,
      init,
    );

    const { fetch } = this.#exportedHandler;
    assert(typeof fetch !== 'undefined');

    const promises: Promise<void>[] = [];

    const response: Response = await fetch(request, this.#env, {
      passThroughOnException: TEST_PASS_THROUGH_ON_EXCEPTION,
      props: null,
      waitUntil(promise: Promise<void>): void {
        promises.push(promise.catch(noop));
      },
    });

    await Promise.all(promises);

    const [firstFetchError] = this.#fetchErrors;
    if (typeof firstFetchError !== 'undefined') {
      throw firstFetchError;
    }

    const [firstMockedResponse] = this.#mockedResponses;
    if (typeof firstMockedResponse !== 'undefined') {
      const [mockedInput] = firstMockedResponse;
      const mockedUrl: string = mapRequestInfoToString(mockedInput);
      throw new Error(`Unused mocked request: ${mockedUrl}`);
    }

    return await TestResponse.from(response);
  }

  public getNow(): number {
    return this.#now();
  }

  readonly #handleMetric: Mock<
    (
      name: string,
      dimensions: Record<string, boolean | number | string>,
    ) => void
  > = vi.fn();

  #mockedFetch = vi.fn(
    (input: RequestInfo, init?: RequestInit): Promise<Response> => {
      const url: string = mapRequestInfoToString(input);

      for (const mockedData of this.#mockedResponses) {
        const [mockedInput, mockedInit, mockedResponse] = mockedData;
        if (!isEqual(url, mockedInput)) {
          continue;
        }

        if (!isEqual(init, mockedInit)) {
          continue;
        }

        const index: number = this.#mockedResponses.findIndex(is(mockedData));
        this.#mockedResponses.splice(index, SINGLE);

        return Promise.resolve(mockedResponse);
      }

      this.#fetchErrors.push(
        new Error(
          `No response is mocked for:
${url}

Initilization:
${JSON.stringify(init)}

Mocked responses include:
${this.mockedResponseUrls.join('\n')}`,
        ),
      );

      return Promise.resolve(new Response());
    },
  );

  public mockResponse(
    input: RequestInfo,
    init: RequestInit,
    response: Response,
  ): void {
    this.#mockedResponses.push([input, init, response]);
  }

  private get mockedResponseUrls(): readonly string[] {
    return this.#mockedResponses.map(mapMockedResponseToUrl);
  }

  public setNow(timestamp: number): void {
    this.#now = (): number => timestamp;
  }
}
