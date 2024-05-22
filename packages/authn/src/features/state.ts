import type { Metric } from '../types/metric.js';
import type Telemetry from '../utils/telemetry.js';
import createReturnHref from './create-return-href.js';
import TelemetryQueue from './telemetry-queue.js';

export default class State {
  readonly #ctx: ExecutionContext;

  #console: Console;

  #env: Record<string, unknown> | null = null;

  readonly #fetch: Fetcher['fetch'];

  readonly #request: Request;

  #returnHref: string | null = null;

  #telemetry: TelemetryQueue | null = null;

  readonly #traceId: string;

  public constructor(
    fetch: Fetcher['fetch'],
    console: Console,
    request: Request,
    ctx: ExecutionContext,
    traceId: string,
  ) {
    this.#console = console;
    this.#ctx = ctx;
    this.#fetch = fetch;
    this.#request = request;
    this.#traceId = traceId;
  }

  public get console(): Console {
    return this.#console;
  }

  public get ctx(): ExecutionContext {
    return this.#ctx;
  }

  public get env(): Record<string, unknown> | null {
    return this.#env;
  }

  public get fetch(): Fetcher['fetch'] {
    return this.#fetch;
  }

  public get request(): Request {
    return this.#request;
  }

  public get returnHref(): string | null {
    return this.#returnHref;
  }

  public get telemetry(): Telemetry<Metric> | null {
    return this.#telemetry;
  }

  public get traceId(): string {
    return this.#traceId;
  }

  public flushTelemetry(): void {
    if (this.#telemetry === null) {
      return;
    }
    this.#telemetry.flush();
  }

  public setEnv(env: Record<string, unknown>): void {
    this.#env = env;
    this.#telemetry = new TelemetryQueue({
      console: this.#console,
      ctx: this.#ctx,
      env,
      traceId: this.#traceId,
    });
  }

  public setReturnHref(): void {
    this.#returnHref = createReturnHref();
  }
}
