import { FullStory } from '@fullstory/browser';
import { renderHook } from '@testing-library/react';
import type { PropsWithChildren, ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MockFullstory from '../components/mock-fullstory.js';
import expectToThrow from '../test/expect-to-throw.js';
import useFullstory from './use-fullstory.js';

const TEST_FULLSTORY = Object.assign(vi.fn(), FullStory);
const TEST_INIT = vi.fn();
const TEST_IS_INITIALIZED = vi.fn();

function TestWrapper({ children }: Readonly<PropsWithChildren>): ReactElement {
  return (
    <MockFullstory
      FullStory={TEST_FULLSTORY}
      init={TEST_INIT}
      isInitialized={TEST_IS_INITIALIZED}
      orgId="test-org-id"
    >
      {children}
    </MockFullstory>
  );
}

describe('useFullstory', (): void => {
  beforeEach((): void => {
    TEST_IS_INITIALIZED.mockReturnValue(false);
    TEST_INIT.mockImplementation((): void => {
      TEST_IS_INITIALIZED.mockReturnValue(true);
    });
  });

  it('should throw when Fullstory is not provided', (): void => {
    expectToThrow(
      useFullstory,
      'Expected the Fullstory context to be provided.',
    );
  });

  it('should provide a Fullstory API', (): void => {
    const { result } = renderHook(useFullstory, {
      wrapper: TestWrapper,
    });

    expect(result).not.toBe(null);
  });
});
