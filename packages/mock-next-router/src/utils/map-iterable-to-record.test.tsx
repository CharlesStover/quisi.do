import { render } from '@testing-library/react';
import { createMemoryHistory, type MemoryHistory } from 'history';
import { assert, describe, expect, it } from 'vitest';
import MockNextRouter from '../index.js';
import createRouterConsumer from '../test/create-router-consumer.js';

describe('mapIterableToRecord', (): void => {
  it('should support URLSearchParams', (): void => {
    const { Consumer, router } = createRouterConsumer();
    const testHistory: MemoryHistory = createMemoryHistory({
      initialEntries: ['/test-pathname?aaa=b&ccc=d&eee=f'],
    });

    const { unmount } = render(
      <MockNextRouter history={testHistory}>
        <Consumer />
      </MockNextRouter>,
    );

    assert(router.current !== null);
    expect(router.current.query).toStrictEqual({
      aaa: 'b',
      ccc: 'd',
      eee: 'f',
    });

    // Unlisten to the router.
    unmount();
  });
});
