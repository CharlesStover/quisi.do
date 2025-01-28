import { render } from '@testing-library/react';
import { type PropsWithChildren, type ReactElement, useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MockAwsRumProvider, withRecordError } from '../index.js';

interface TestProps {
  readonly recordError: (error: unknown) => void;
}

const TEST_RECORD_ERROR = vi.fn();

function TestComponent({ recordError }: TestProps): null {
  useEffect((): void => {
    recordError('test error');
  }, [recordError]);

  return null;
}

const TestHoc = withRecordError(TestComponent);

describe('withRecordError', (): void => {
  it('should provide a `recordError` prop', (): void => {
    render(<TestHoc />, {
      wrapper({ children }: PropsWithChildren): ReactElement {
        return (
          <MockAwsRumProvider recordError={TEST_RECORD_ERROR}>
            {children}
          </MockAwsRumProvider>
        );
      },
    });

    expect(TEST_RECORD_ERROR).toHaveBeenCalledOnce();
    expect(TEST_RECORD_ERROR).toHaveBeenLastCalledWith('test error');
  });
});
