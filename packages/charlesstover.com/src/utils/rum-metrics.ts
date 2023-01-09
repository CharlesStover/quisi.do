import type RumMetricsType from '../types/rum-metrics';
import type RumMetricsError from '../types/rum-metrics-error';

interface Options {
  readonly accessKey: string;
  readonly fetch: Window['fetch'];
}

// TODO: Replace this with `zod`.
const filterByRumMetricsResponse = (
  value: unknown,
): value is RumMetricsError | RumMetricsType => value !== null;
const validateRumMetricsResponse = (
  value: unknown,
): RumMetricsError | RumMetricsType => {
  if (!filterByRumMetricsResponse(value)) {
    throw new Error('Expected rum metrics.');
  }
  return value;
};

export default class RumMetrics {
  private readonly _accessKey: string;

  private _cache: RumMetricsType | null = null;

  private readonly _fetch: Window['fetch'];

  public constructor({ accessKey, fetch }: Readonly<Options>) {
    this._accessKey = accessKey;
    this._fetch = fetch;
  }

  private get url(): string {
    return `https://rum.cscdn.net/rum?accessKey=${this._accessKey}`;
  }

  public handleRequest = async (): Promise<RumMetricsType> => {
    if (this._cache !== null) {
      return this._cache;
    }

    const response: Response = await this._fetch(this.url);
    const json: unknown = await response.json();
    const data: RumMetricsError | RumMetricsType =
      validateRumMetricsResponse(json);

    if ('message' in data) {
      throw new Error(data.message);
    }

    this._cache = data;
    return data;
  };
}