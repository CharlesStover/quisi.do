'use client';

import { useRecordError } from 'aws-rum-react';
import { type ReactElement, useEffect } from 'react';

/**
 * Error boundaries must `'use client'`.
 *
 *   Technical debt: If the application crashes, does this error boundary even
 * have access to the `aws-rum-react` or `lazy-i18n` context provider?
 */

interface Props {
  readonly error: Error;
  readonly reset: VoidFunction;
}

export default function ErrorBoundary({ error, reset }: Props): ReactElement {
  const recordError = useRecordError();

  useEffect((): void => {
    recordError(error);
  }, [error, recordError]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <pre>{error.message}</pre>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
