import { act, render } from '@testing-library/react';
import { createMemoryHistory, type MemoryHistory } from 'history';
import {
  afterEach,
  assert,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import MockNextRouter from '../index.js';

const FIRST = 0;
const TEST_HASH_CHANGE_LISTENER = vi.fn();

describe('useHashChangeEvents', (): void => {
  beforeEach((): void => {
    window.addEventListener('hashchange', TEST_HASH_CHANGE_LISTENER);
  });

  afterEach((): void => {
    window.removeEventListener('hashchange', TEST_HASH_CHANGE_LISTENER);
  });

  it('should emit a hash change event for changed hash', (): void => {
    const history: MemoryHistory = createMemoryHistory({
      initialEntries: ['/old-pathname?search=old#old-hash'],
    });

    render(<MockNextRouter history={history}>test</MockNextRouter>);

    act((): void => {
      history.push('/new-pathname?search=new#new-hash');
    });

    expect(TEST_HASH_CHANGE_LISTENER).toHaveBeenCalledOnce();

    const firstCallArguments: unknown =
      TEST_HASH_CHANGE_LISTENER.mock.calls[FIRST];
    assert(Array.isArray(firstCallArguments));
    const firstCallArgument: unknown = firstCallArguments[FIRST];
    assert(firstCallArgument instanceof HashChangeEvent);
    expect(firstCallArgument.newURL).toBe(
      'https://localhost/new-pathname?search=new#new-hash',
    );
  });

  it('should not emit a hash change event for same hash', (): void => {
    const history: MemoryHistory = createMemoryHistory({
      initialEntries: ['/pathname?search#hash'],
    });

    render(<MockNextRouter history={history}>test</MockNextRouter>);

    act((): void => {
      history.push('/pathname?search#hash');
    });

    expect(TEST_HASH_CHANGE_LISTENER).not.toHaveBeenCalled();
  });
});
