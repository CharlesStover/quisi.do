# [quisi.do](https://quisi.do/) workers

This module contains utility classes for generating Cloudflare workers.

## Exported handlers

Cloudflare expects your entrypoint to export an `ExportedHandler` interface. To
simplify the process of binding your application code to the runtime
environment, use the `ExportedHandler` class and pass your
[event handlers](#event-handlers) to its constructor.

```ts
import { ExportedHandler } from '@quisido/worker';
import MyFetchHandler from './my-fetch-handler.js';

export default new ExportedHandler({
  FetchHandler: MyFetchHandler,
});
```

In addition to binding event handlers to the exported handler, `Handler`s allow
you to conveniently emit errors, logs, and metrics from anywhere in your
application by binding an event listener at your entrypoint.

```ts
import { ExportedHandler, type Handler } from '@quisido/worker';
import MyFetchHandler from './my-fetch-handler.js';

export default new ExportedHandler({
  FetchHandler: MyFetchHandler,

  // Write errors to the console.
  onError(this: Handler, err: Error): void {
    this.console.error(err);
  },

  // Write logs to the console.
  onLog(this: Handler, ...messages: readonly string[]): void {
    this.console.log(...messages);
  },

  // Write metrics to the `MY_DATASET` Analytics Engine dataset.
  onMetric(this: Handler, name: string, dimensions: MetricDimensions): void {
    this.writeMetricDataPoint('MY_DATASET', name, dimensions);
  },
});
```

## Event handlers

`Handler`s are class representations of Cloudfare worker
[event handlers][handlers] (`email`, `fetch`, `queue`, `scheduled`, `tail`, and
`trace`).

Currently, this package only supports the `fetch` event handler while developer
feedback is gathered.

Cloudflare's native exported handler executes event handlers as simple
functions, which [lack state][the-struggle-of-state-management] and limit
testability. This package's `Handler`s are runnable interfaces that allow you to
append your own properties and methods to each event handler. They come with
built-in utility methods for common Cloudflare use cases.

```ts
import { type Handler, type MetricDimensions } from '@quisido/worker';
import ExampleThing from './example-thing.js';

export default async function myMethod(this: Handler): Promise<void> {
  // Emit asynchronous side effects to await after the `Response` has returned.
  this.affect(promise);

  // Emit a metric for monitoring.
  this.emitMetric('my-metric-name', {
    myBoolean: true,
    myNumber: 1234,
    myString: 'my-value',
  });

  // Fetch a Response.
  const response: Response = await this.fetch('https://...');

  // Fetch JSON.
  const responseJson: unknown = await this.fetchJson('https://...');

  // Fetch a string.
  const responseText: string = await this.fetchText('https://...');

  // Get an Analytics Engine dataset binding.
  const dataset: AnalyticsEngineDataset =
    this.getAnalyticsEngineDataset('MY_DATASET');

  // Get a D1 database binding.
  const database: D1Database = this.getD1Database('MY_DATABASE');

  /**
   * Run a D1 query.
   * ┌─────────────┬──────────┐
   * │     Key     │   Type   │
   * ├─────────────┼──────────┤
   * │ changedDb   │ boolean  │
   * │ changes     │ number   │
   * │ duration    │ number   │
   * │ lastRowId   │ number   │
   * │ rowsRead    │ number   │
   * │ rowsWritten │ number   │
   * │ sizeAfter   │ number   │
   * └─────────────┴──────────┘
   */
  const d1Response = await this.getD1Response(
    'MY_DATABASE',
    'INSERT INTO `myTable` (`myNumber`, `myString`) VALUES (?, ?)',
    [1234, 'my string'],
  );

  /**
   * Get D1 results.
   * ┌─────────────┬────────────────────────────┐
   * │     Key     │            Type            │
   * ├─────────────┼────────────────────────────┤
   * │ changedDb   │ boolean                    │
   * │ changes     │ number                     │
   * │ duration    │ number                     │
   * │ lastRowId   │ number                     │
   * │ results     │ Record<string, unknown>[]  │
   * │ rowsRead    │ number                     │
   * │ rowsWritten │ number                     │
   * │ sizeAfter   │ number                     │
   * └─────────────┴────────────────────────────┘
   */
  const { results } = await this.getD1Results(
    'MY_DATABASE',
    'SELECT `myString` FROM `myTable` WHERE `myNumber` = ?',
    [1234],
  );

  // Get a KV namespace binding.
  const namespace: KVNamespace = this.getKVNamespace('MY_NAMESPACE');

  // Get text from a KV namespace.
  const kvText: string = this.getKVNamespaceText('MY_NAMESPACE', 'KEY');

  // Get an R2 bucket binding.
  const bucket: R2Bucket = this.getR2Bucket('MY_BUCKET');

  // Log a message.
  this.log('Hello world!');

  // Emit an error.
  this.logError(new Error('Goodbye world.'));

  // Get the current timestamp (mockable).
  const startTime: number = this.now();

  // Write to a KV namespace.
  await this.putKVNamespace('MY_NAMESPACE', 'key', 'value');

  // Write to an R2 bucket.
  await this.putR2Bucket('MY_BUCKET', 'key', 'value');

  // Validate a binding.
  const myThing: Thing = this.validateBinding(
    'MY_BINDING',
    (value: unknown): value is ExampleThing =>
      value instanceof ExampleThing,
  );

  // Write a metric to an Analytics Engine dataset.
  this.writeMetricDataPoint(
    'MY_DATASET',
    'my-metric-name',
    { my: 'dimensions' },
  );
}
```

### Fetch handlers

`FetchHandler` extends the `Handler` class. Its constructor takes a native
Cloudflare fetch handler and an optional error handler. A `FetchHandler`
includes fetch-specific properties and methods in addition to those provided by
the `Handler` class.

```ts
import { FetchHandler } from '@quisido/worker';

export default async function myMethod(this: FetchHandler): Promise<void> {
  /**
   * `FetchHandler`-specific properties of `this`
   * ┌──────────────────────┬────────────────────────┐
   * │       Property       │          Type          │
   * ├──────────────────────┼────────────────────────┤
   * │ cookies              │ Record<string, string> │
   * │ executionContext     │ ExecutionContext       │
   * │ origin               │ string | null          │
   * │ request              │ Request                │
   * │ requestHeaders       │ Headers                │
   * │ requestMethod        │ string                 │
   * │ requestPathname      │ string                 │
   * │ requestSearchParams  │ URLSearchParams        │
   * │ requestUrl           │ URL                    │
   * └──────────────────────┴────────────────────────┘
   */

  // Get a specific cookie.
  const cookie: string | undefined = this.getCookie('MyCookie');

  // Get a search parameter.
  const searchValue: string | null = this.getRequestSearchParam('code');

  // Get the request body.
  const text: string = await this.getRequestText();
}
```

## Metrics

The `Handler` utility methods will automatically emit valuable metrics for
common operations. You can access the human-readable `enum` by importing
`MetricName`.

| Metric name                 | Condition                                          |
|-----------------------------|----------------------------------------------------|
| `MetricName.D1All`          | Emits after calling `getD1Results`                 |
| `MetricName.D1Error`        | Emits when `getD1Response` or `getD1Results` fails |
| `MetricName.D1Run`          | Emits after calling `getD1Response`                |
| `MetricName.Fetch`          | Emits after calling `fetch`                        |
| `MetricName.InvalidBinding` | Emits when `validateBinding` fails                 |
| `MetricName.KVGet`          | Emits after calling `getKVNamespaceText`           |
| `MetricName.KVGetError`     | Emits when `getKVNamespaceText` fails              |
| `MetricName.KVPut`          | Emits after calling `putKVNamespace`               |
| `MetricName.KVPutError`     | Emits when `putKVNamespace` fails                  |
| `MetricName.R2Put`          | Emits after calling `putR2Bucket`                  |
| `MetricName.R2PutError`     | Emits when `putR2Bucket` fails                     |

### Dimensions

When each metric is emit, it includes a set of dimensions as defined below.

| Metric name                 | Dimension     | Type      |
|-----------------------------|---------------|-----------|
| `MetricName.D1All`          | `changedDb`   | `boolean` |
|                             | `changes`     | `number`  |
|                             | `duration`    | `number`  |
|                             | `endTime`     | `number`  |
|                             | `env`         | `string`  |
|                             | `lastRowId`   | `number`  |
|                             | `query`       | `string`  |
|                             | `results`     | `number`  |
|                             | `rowsRead`    | `number`  |
|                             | `rowsWritten` | `number`  |
|                             | `sizeAfter`   | `number`  |
|                             | `startTime`   | `number`  |
| `MetricName.D1Error`        | `endTime`     | `number`  |
|                             | `env`         | `string`  |
|                             | `query`       | `string`  |
|                             | `startTime`   | `number`  |
| `MetricName.D1Run`          | `changedDb`   | `boolean` |
|                             | `changes`     | `number`  |
|                             | `duration`    | `number`  |
|                             | `endTime`     | `number`  |
|                             | `env`         | `string`  |
|                             | `lastRowId`   | `number`  |
|                             | `query`       | `string`  |
|                             | `rowsRead`    | `number`  |
|                             | `rowsWritten` | `number`  |
|                             | `sizeAfter`   | `number`  |
|                             | `startTime`   | `number`  |
| `MetricName.Fetch`          | `endTime`     | `number`  |
|                             | `startTime`   | `number`  |
|                             | `url`         | `string`  |
| `MetricName.InvalidBinding` | `key`         | `string`  |
|                             | `type`        | `string`  |
|                             | `value`       | `string`  |
| `MetricName.KVGet`          | `endTime`     | `number`  |
|                             | `env`         | `string`  |
|                             | `startTime`   | `number`  |
| `MetricName.KVGetError`     | `endTime`     | `number`  |
|                             | `env`         | `string`  |
|                             | `startTime`   | `number`  |
| `MetricName.KVPut`          | `endTime`     | `number`  |
|                             | `env`         | `string`  |
|                             | `startTime`   | `number`  |
| `MetricName.KVPutError`     | `endTime`     | `number`  |
|                             | `env`         | `string`  |
|                             | `startTime`   | `number`  |
| `MetricName.R2Put`          | `endTime`     | `number`  |
|                             | `env`         | `string`  |
|                             | `startTime`   | `number`  |
| `MetricName.R2PutError`     | `endTime`     | `number`  |
|                             | `env`         | `string`  |
|                             | `startTime`   | `number`  |

## Testing

The `ExportedHandler` and `Handler` classes were built with testing in mind.
Their APIs are fully extensible and configurable across any testing environment.
If you are testing with `vitest`, you can use
[the `@quisido/worker-test` package][worker-test] for a collection of common
testing patterns.

[handlers]: https://developers.cloudflare.com/workers/runtime-apis/handlers/
[the-struggle-of-state-management]: https://medium.com/@quisido/cloudflare-workers-dx-the-struggle-of-state-management-6cbc4e054544
[worker-test]: https://www.npmjs.com/package/@quisido/worker-test
