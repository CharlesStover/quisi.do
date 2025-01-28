import { render } from '@testing-library/react';
import { mapToString } from 'fmrs';
import { type ReactElement } from 'react';

const TEST_ID = 'render-hook-error';

export default function renderHookError(useHook: () => unknown): string {
  const TestHookErrorComponent = (): ReactElement | null => {
    try {
      useHook();
      return null;
    } catch (err: unknown) {
      const errStr: string = mapToString(err);
      return <span data-testid={TEST_ID}>{errStr}</span>;
    }
  };

  const { getByTestId } = render(<TestHookErrorComponent />);
  return getByTestId(TEST_ID).innerHTML;
}
