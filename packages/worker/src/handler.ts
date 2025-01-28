/// <reference types="@cloudflare/workers-types" />

import {
  isAnalyticsEngineDataset,
  isD1Database,
  isKVNamespace,
  isR2Bucket,
} from 'cloudflare-utils';
import { EventEmitter } from 'eventemitter3';
import { isRecord, mapToError } from 'fmrs';
import mapMetricDimensionsToDataPoint from './map-metric-dimensions-to-datapoint.js';
import mapRequestInfoToString from './map-request-info-to-string.js';
import type { MetricDimensions } from './metric-dimensions.js';
import { MetricName } from './metric-name.js';
import type Runnable from './runnable.js';

interface EventTypes {
  readonly effect: [Promise<unknown>];
  readonly error: [Error];
  readonly log: string[];
  readonly metric: [string, MetricDimensions];
}

export interface HandlerOptions<Env> {
  readonly console: Console;
  readonly env: Env;
  readonly fetch: Fetcher['fetch'];
  readonly now?: (() => number) | undefined;
}

type HandlerParameters<
  K extends keyof Required<ExportedHandler>,
  Env,
  QueueHandlerMessage,
  CfHostMetadata,
> = readonly [
  HandlerOptions<Env>,
  ...Parameters<
    Required<ExportedHandler<Env, QueueHandlerMessage, CfHostMetadata>>[K]
  >,
];

export interface HandlerD1Response {
  readonly changedDb: boolean;
  readonly changes: number;
  readonly duration: number;
  readonly lastRowId: number;
  readonly rowsRead: number;
  readonly rowsWritten: number;
  readonly sizeAfter: number;
}

export interface HandlerD1Results extends HandlerD1Response {
  readonly results: readonly Record<string, unknown>[];
}

type HandlerReturnType<
  K extends keyof Required<ExportedHandler>,
  Env,
  QueueHandlerMessage,
  CfHostMetadata,
> = ReturnType<
  Required<ExportedHandler<Env, QueueHandlerMessage, CfHostMetadata>>[K]
>;

const EMPTY_OBJECT: Record<string, never> = {};
const FIRST = 0;

export default class Handler<
  K extends keyof Required<ExportedHandler> = keyof Required<ExportedHandler>,
  Env = unknown,
  QueueHandlerMessage = unknown,
  CfHostMetadata = unknown,
> implements
    Runnable<
      HandlerReturnType<K, Env, QueueHandlerMessage, CfHostMetadata>,
      HandlerParameters<K, Env, QueueHandlerMessage, CfHostMetadata>
    >
{
  readonly #eventEmitter = new EventEmitter<EventTypes>();
  #console: Console = console;
  #env: Env | undefined;
  readonly #eventQueue: (() => void)[] = [];
  #fetch: Fetcher['fetch'] | undefined;
  #flushed = false;
  #now: () => number = Date.now.bind(Date);

  public readonly run: (
    /**
     *   Technical debt: This should be something like `this: this`, to denote
     * that the `handle` function will be bound to the `Handler` object.
     * However, doing so results in an error: classes that extend `Handler`
     * cannot be assigned to `new () => Handler`, because their `handle`'s
     * `this` types are incompatible.
     */
    options: HandlerOptions<Env>,
    ...params: Parameters<
      Required<ExportedHandler<Env, QueueHandlerMessage, CfHostMetadata>>[K]
    >
  ) => ReturnType<
    Required<ExportedHandler<Env, QueueHandlerMessage, CfHostMetadata>>[K]
  >;

  public constructor(
    handler: (
      ...params: Parameters<
        Required<ExportedHandler<Env, QueueHandlerMessage, CfHostMetadata>>[K]
      >
    ) => ReturnType<
      Required<ExportedHandler<Env, QueueHandlerMessage, CfHostMetadata>>[K]
    >,
  ) {
    this.affect = this.affect.bind(this);
    this.emitMetric = this.emitMetric.bind(this);
    this.fetch = this.fetch.bind(this);
    this.fetchJson = this.fetchJson.bind(this);
    this.fetchText = this.fetchText.bind(this);
    this.flush = this.flush.bind(this);
    this.getAnalyticsEngineDataset = this.getAnalyticsEngineDataset.bind(this);
    this.getBinding = this.getBinding.bind(this);
    this.getD1Database = this.getD1Database.bind(this);
    this.getD1Response = this.getD1Response.bind(this);
    this.getD1Results = this.getD1Results.bind(this);
    this.getKVNamespace = this.getKVNamespace.bind(this);
    this.getR2Bucket = this.getR2Bucket.bind(this);
    this.log = this.log.bind(this);
    this.logError = this.logError.bind(this);
    this.now = this.now.bind(this);
    this.onError = this.onError.bind(this);
    this.onLog = this.onLog.bind(this);
    this.onMetric = this.onMetric.bind(this);
    this.onSideEffect = this.onSideEffect.bind(this);
    this.putKVNamespace = this.putKVNamespace.bind(this);
    this.putR2Bucket = this.putR2Bucket.bind(this);
    this.validateBinding = this.validateBinding.bind(this);
    this.writeMetricDataPoint = this.writeMetricDataPoint.bind(this);

    this.run = (
      { console, env, fetch, now }: HandlerOptions<Env>,
      ...params: Parameters<
        Required<ExportedHandler<Env, QueueHandlerMessage, CfHostMetadata>>[K]
      >
    ): ReturnType<
      Required<ExportedHandler<Env, QueueHandlerMessage, CfHostMetadata>>[K]
    > => {
      this.#console = console;
      this.#env = env;
      this.#fetch = fetch;
      if (typeof now !== 'undefined') {
        this.#now = now;
      }

      const result: ReturnType<
        Required<ExportedHandler<Env, QueueHandlerMessage, CfHostMetadata>>[K]
      > = handler.call(this, ...params);
      if (!(result instanceof Promise)) {
        this.flush();
        return result;
      }

      // `response` is `Response | void`.
      return result.then((response: unknown): unknown => {
        this.flush();
        return response;
      }) as ReturnType<
        Required<ExportedHandler<Env, QueueHandlerMessage, CfHostMetadata>>[K]
      >;
    };
  }

  public affect(promise: Promise<unknown>): void {
    this.#emit('effect', promise);
  }

  public get console(): Console {
    return this.#console;
  }

  #emit<T extends EventEmitter.EventNames<EventTypes>>(
    event: T,
    ...args: EventEmitter.EventArgs<EventTypes, T>
  ): boolean {
    if (this.#flushed) {
      this.#eventEmitter.emit(event, ...args);
      return true;
    }

    this.#eventQueue.push((): void => {
      this.#eventEmitter.emit(event, ...args);
    });
    return true;
  }

  public emitMetric(
    name: string,
    dimensions: Record<
      number | string | symbol,
      boolean | number | string
    > = EMPTY_OBJECT,
  ): void {
    this.#emit('metric', name, dimensions);
  }

  public async fetch(
    input: RequestInfo<unknown, CfProperties>,
    init?: RequestInit,
  ): Promise<Response> {
    if (typeof this.#fetch === 'undefined') {
      throw new Error('You may only fetch during an operation.');
    }

    const startTime: number = this.now();
    try {
      const response: Response = await this.#fetch.call(null, input, init);
      return response;
    } finally {
      const url: string = mapRequestInfoToString(input);
      this.emitMetric(MetricName.Fetch, {
        endTime: this.now(),
        startTime,
        url,
      });
    }
  }

  public async fetchJson(
    input: RequestInfo,
    init?: RequestInit,
  ): Promise<unknown> {
    const response: Response = await this.fetch(input, init);
    return await response.json();
  }

  public async fetchText(
    input: RequestInfo,
    init?: RequestInit,
  ): Promise<string> {
    const response: Response = await this.fetch(input, init);
    return await response.text();
  }

  public flush(): void {
    this.#flushed = true;

    const { length } = this.#eventQueue;
    const queue: (() => void)[] = this.#eventQueue.splice(FIRST, length);
    for (const fn of queue) {
      fn.call(this);
    }
  }

  public getAnalyticsEngineDataset(name: string): AnalyticsEngineDataset {
    return this.validateBinding(name, isAnalyticsEngineDataset);
  }

  /**
   *   Technical debt: This should be `<K extends keyof Env>(key: K): Env[K]`,
   * but that would (1) require `Env` be typed and (2) lose type-safety by
   * assuming `Env[K]` is the correct type. If the constructor can include a
   * `validateBinding: Record<keyof Env, (value: unknown) => value is Env[K]>`
   * type, this may be doable with `this.#validateBinding(this.#env[key])`.
   */
  public getBinding(key: string): unknown {
    if (isRecord(this.#env)) {
      return this.#env[key];
    }

    throw new Error('Bindings may only be accessed during an operation.');
  }

  public getD1Database(name: string): D1Database {
    return this.validateBinding(name, isD1Database);
  }

  public async getD1Response(
    env: string,
    query: string,
    bindings: readonly (null | number | string)[],
  ): Promise<HandlerD1Response> {
    const startTime: number = this.now();
    try {
      const {
        meta: {
          changed_db: changedDb,
          changes,
          duration,
          last_row_id: lastRowId,
          rows_read: rowsRead,
          rows_written: rowsWritten,
          size_after: sizeAfter,
        },
      } = await this.getD1Database(env)
        .prepare(query)
        .bind(...bindings)
        .run();
      this.emitMetric(MetricName.D1Run, {
        changedDb,
        changes,
        duration,
        endTime: this.now(),
        env,
        lastRowId,
        query,
        rowsRead,
        rowsWritten,
        sizeAfter,
        startTime,
      });

      return {
        changedDb,
        changes,
        duration,
        lastRowId,
        rowsRead,
        rowsWritten,
        sizeAfter,
      };
    } catch (err: unknown) {
      const error: Error = mapToError(err);
      this.logError(error);

      this.emitMetric(MetricName.D1Error, {
        endTime: this.now(),
        env,
        query,
        startTime,
      });

      throw err;
    }
  }

  public async getD1Results(
    env: string,
    query: string,
    values: readonly (null | number | string)[],
  ): Promise<HandlerD1Results> {
    const startTime: number = this.now();

    try {
      const {
        results,

        meta: {
          changed_db: changedDb,
          changes,
          duration,
          last_row_id: lastRowId,
          rows_read: rowsRead,
          rows_written: rowsWritten,
          size_after: sizeAfter,
        },
      } = await this.getD1Database(env)
        .prepare(query)
        .bind(...values)
        .all();

      this.emitMetric(MetricName.D1All, {
        changedDb,
        changes,
        duration,
        endTime: this.now(),
        env,
        lastRowId,
        query,
        results: results.length,
        rowsRead,
        rowsWritten,
        sizeAfter,
        startTime,
      });

      return {
        changedDb,
        changes,
        duration,
        lastRowId,
        results,
        rowsRead,
        rowsWritten,
        sizeAfter,
      };
    } catch (err: unknown) {
      const error: Error = mapToError(err);
      this.logError(error);

      this.emitMetric(MetricName.D1Error, {
        endTime: this.now(),
        env,
        query,
        startTime,
      });

      throw err;
    }
  }

  public getKVNamespace(name: string): KVNamespace {
    return this.validateBinding(name, isKVNamespace);
  }

  public async getKVNamespaceText(
    env: string,
    key: string,
  ): Promise<string | null> {
    const namespace: KVNamespace = this.getKVNamespace(env);
    const startTime: number = this.now();

    try {
      const value: string | null = await namespace.get(key, 'text');
      this.emitMetric(MetricName.KVGet, {
        endTime: this.now(),
        env,
        startTime,
      });

      return value;
    } catch (err: unknown) {
      const error: Error = mapToError(err);
      this.logError(error);
      this.emitMetric(MetricName.KVGetError, {
        endTime: this.now(),
        env,
        startTime,
      });

      return null;
    }
  }

  public getR2Bucket(name: string): R2Bucket {
    return this.validateBinding(name, isR2Bucket);
  }

  public log(...messages: readonly string[]): void {
    this.#emit('log', ...messages);
  }

  public logError(err: Error): void {
    this.#emit('error', err);
  }

  public now(): number {
    return this.#now();
  }

  #on<K extends keyof EventTypes>(
    event: K,
    callback: (...args: EventTypes[K]) => Promise<void> | void,
  ): void {
    const handleError = (err: unknown): void => {
      const error: Error = mapToError(err);

      // If errors cannot be emit, use the console.
      if (event === 'error') {
        this.console.error(error);
        return;
      }

      this.#emit('error', error);
    };

    const handleEvent = (...args: EventTypes[K]): void => {
      try {
        const promise: Promise<void> | void = callback.apply(this, args);
        if (!(promise instanceof Promise)) {
          return;
        }

        this.affect(promise.catch(handleError));
      } catch (err: unknown) {
        handleError(err);
      }
    };

    this.#eventEmitter.on(event, handleEvent);
  }

  public onError(callback: (error: Error) => Promise<void> | void): void {
    this.#on('error', callback.bind(this));
  }

  public onLog(
    callback: (...messages: readonly string[]) => Promise<void> | void,
  ): void {
    this.#on('log', callback.bind(this));
  }

  public onMetric(
    callback: (
      name: string,
      dimensions: MetricDimensions,
    ) => Promise<void> | void,
  ): void {
    this.#on('metric', callback.bind(this));
  }

  public onSideEffect(
    callback: (effect: Promise<unknown>) => Promise<void> | void,
  ): void {
    this.#on('effect', callback.bind(this));
  }

  public async putKVNamespace(
    env: string,
    ...params: Parameters<KVNamespace['put']>
  ): Promise<void> {
    const namespace: KVNamespace = this.getKVNamespace(env);
    const startTime: number = this.now();
    try {
      await namespace.put(...params);
      this.emitMetric(MetricName.KVPut, {
        endTime: this.now(),
        env,
        startTime,
      });
    } catch (err: unknown) {
      const error: Error = mapToError(err);
      this.logError(error);
      this.emitMetric(MetricName.KVPutError, {
        endTime: this.now(),
        env,
        startTime,
      });
    }
  }

  public async putR2Bucket(
    env: string,
    ...params: Parameters<R2Bucket['put']>
  ): Promise<void> {
    const bucket: R2Bucket = this.getR2Bucket(env);
    const startTime: number = this.now();
    try {
      await bucket.put(...params);
      this.emitMetric(MetricName.R2Put, {
        endTime: this.now(),
        env,
        startTime,
      });
    } catch (err: unknown) {
      const error: Error = mapToError(err);
      this.logError(error);
      this.emitMetric(MetricName.R2PutError, {
        endTime: this.now(),
        env,
        startTime,
      });
    }
  }

  public validateBinding<T>(
    key: string,
    isValid: (value: unknown) => value is T,
    defaultValue?: T,
  ): T {
    const value: unknown = this.getBinding(key);
    if (isValid(value)) {
      return value;
    }

    /**
     *   We must use `null` to represent `undefined`, because
     * `JSON.stringify(undefined)` is `undefined`, which will cause the `value`
     * property to be dropped from the object.
     */
    const valueStr: string = JSON.stringify(value ?? null);
    this.emitMetric(MetricName.InvalidBinding, {
      key,
      type: typeof value,
      value: valueStr,
    });

    if (typeof defaultValue !== 'undefined') {
      return defaultValue;
    }

    throw new Error(`Invalid "${key}" environment variable`);
  }

  public writeMetricDataPoint(
    dataset: string,
    name: string,
    dimensions: MetricDimensions,
  ): void {
    this.getAnalyticsEngineDataset(dataset).writeDataPoint({
      ...mapMetricDimensionsToDataPoint(dimensions),
      indexes: [name],
    });
  }
}
