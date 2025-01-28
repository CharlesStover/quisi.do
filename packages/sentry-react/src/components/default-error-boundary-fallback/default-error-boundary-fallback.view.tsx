import { mapToString } from 'fmrs';
import type { ReactElement } from 'react';

interface Props {
  readonly error: unknown;
  // Readonly resetError: () => void;
}

export default function DefaultErrorBoundaryFallback({
  error,
}: Props): ReactElement {
  return <>{mapToString(error)}</>;
}
