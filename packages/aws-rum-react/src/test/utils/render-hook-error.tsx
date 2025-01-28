import { render } from '@testing-library/react';
import { mapToString } from 'fmrs';
import type { ReactElement } from 'react';

const TEST_ID = 'render-hook-error';

export default function renderHookError(useHook: () => unknown): string {
  function TestHookErrorComponent(): ReactElement | null {
    try {
      useHook();
      return null;
    } catch (err: unknown) {
      return <span data-testid={TEST_ID}>{mapToString(err)}</span>;
    }
  }

  const { getByTestId } = render(<TestHookErrorComponent />);
  return getByTestId(TEST_ID).innerHTML;
}
