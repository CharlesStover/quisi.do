import { FullStory } from '@fullstory/browser';
import { act, renderHook } from '@testing-library/react';
import type { PropsWithChildren, ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MockFullstory, useFullstory } from '../index.js';

const TEST_FULLSTORY = Object.assign(vi.fn(), FullStory);
const TEST_SHUTDOWN = vi.fn();

describe('mapV2OperationHandlersToApi', (): void => {
  it('should call a mocked FullStory API', (): void => {
    const { result } = renderHook(useFullstory, {
      initialProps: {
        orgId: 'my-org-id',
      },
      wrapper({ children }: PropsWithChildren): ReactElement {
        return (
          <MockFullstory FullStory={TEST_FULLSTORY} orgId="test-org-id">
            {children}
          </MockFullstory>
        );
      },
    });

    act((): void => {
      result.current('shutdown');
    });

    expect(TEST_FULLSTORY).toHaveBeenCalledOnce();
    expect(TEST_FULLSTORY).toHaveBeenLastCalledWith(
      'shutdown',
      undefined,
      undefined,
    );
  });

  it('should return a mocked FullStory API', (): void => {
    const { result } = renderHook(useFullstory, {
      initialProps: {
        orgId: 'my-org-id',
      },
      wrapper({ children }: PropsWithChildren): ReactElement {
        return (
          <MockFullstory onShutdown={TEST_SHUTDOWN} orgId="test-org-id">
            {children}
          </MockFullstory>
        );
      },
    });

    act((): void => {
      result.current('shutdown');
    });

    expect(TEST_SHUTDOWN).toHaveBeenCalledOnce();
  });
});
