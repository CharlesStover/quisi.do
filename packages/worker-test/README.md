# [quisi.do](https://quisi.do/) worker test utilities

This module contains test utilities for `ExportedHandler`s from
[the `@quisi.do/worker` package][worker].

## `TestExportedHandler`

A `TestExportedHandler` is the entrypoint to your test. It orchestrates your
service calls and worker state in a `vitest` environment. Provide it with the
same `FetchHandler` and event listeners for errors, logs, and metrics that you
provide to your production `ExportedHandler` in `src/index.ts`.

```ts
import { TestExportedHandler } from '@quisido/worker-test';
import { describe, expect, it } from 'vitest';
import MyFetchHandler from './my-fetch-handler.js';

const BAD_GATEWAY = 502;

describe('MyService', (): void => {
  it('should emit a metric for profile pathnames', async (): Promise<void> => {
    // Assemble
    const { expectMetric, fetch } = new TestExportedHandler({
      FetchHandler: MyFetchHandler,
    });

    // Act
    await fetch('/profile/1234/');

    // Assert
    expectMetric('profile-view', { userId: 1234 });
  });

  it('should should write Analytics Engine data points', async (): Promise<void> => {
    // Assemble
    const {
      expectNotToHaveWrittenDataPoint,
      expectToHaveWrittenDataPoint,
      fetch,
    } = new TestExportedHandler({
      FetchHandler: MyFetchHandler,
    });

    // Act
    await fetch('/reporting-endpoint', {
      body: 'Hello',
      method: 'POST',
    });

    // Assert
    expectToHaveWrittenDataPoint('MY_REPORTS', {
      blobs: ['Hello'],
      doubles: [expect.any(Number)],
      indexes: ['report'],
    });

    expectNotToHaveWrittenDataPoint('MY_REPORTS', {
      blobs: expect.any(Array),
      doubles: expect.any(Array),
      indexes: ['report-error'],
    });
  });

  it(
    'should respond with BadGateway when a dependency fails',
    async (): Promise<void> => {
      // Assemble
      const { fetch, mockResponse } = new TestExportedHandler({
        FetchHandler: MyFetchHandler,
      });

      mockResponse(
        'https://localhost/some-dependency/',
        {},
        new Response(null, { status: 400 }),
      );

      // Act
      const {
        expectBodyToBe,
        expectHeaderToBe,
        expectStatusCodeToBe,
      } = await fetch('/data');

      // Assert
      expectStatusCodeToBe(BAD_GATEWAY);
      expectHeaderToBe('content-type', 'text/json; charset=utf-8');
      expectBodyToBe('{"code":1234}');
    },
  );
});
```

[worker]: https://www.npmjs.com/package/@quisido/worker
