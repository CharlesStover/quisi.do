import { render } from '@testing-library/react';
import {
  Component,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
} from 'react';
import { expect, vi } from 'vitest';

interface State {
  readonly error?: Error | undefined;
}

const CONSOLE_ERROR: Console['error'] = console.error;

const testGetDerivedStateFromErrorImpl = (err: Error): State => ({
  error: err,
});

export default function expectToThrow(
  useHook: VoidFunction,
  message: string,
): void {
  console.error = vi.fn();

  const testGetDerivedStateFromError = vi.fn(testGetDerivedStateFromErrorImpl);

  class Boundary extends Component<PropsWithChildren, State> {
    public static getDerivedStateFromError = testGetDerivedStateFromError;

    public override state: State = {};

    public override render(): ReactNode {
      if (typeof this.state.error !== 'undefined') {
        return null;
      }

      return this.props.children;
    }
  }

  function Hook(): undefined {
    useHook();
  }

  render(<Hook />, {
    wrapper({ children }: PropsWithChildren): ReactElement {
      return <Boundary>{children}</Boundary>;
    },
  });

  expect(testGetDerivedStateFromError).toHaveBeenCalledWith(new Error(message));

  console.error = CONSOLE_ERROR;
}
