import { mapToString } from 'fmrs';
import type { ReactElement } from 'react';
import useEmit from '../hooks/use-emit/use-emit.js';
import { PieChart as GooglePieChart } from '../modules/react-google-charts/index.js';

interface Props {
  readonly data: readonly (readonly (number | string)[])[];
}

export default function PieChart({ data }: Props): ReactElement {
  // Contexts
  const emit = useEmit();

  return (
    <GooglePieChart
      data={data}
      onError={(err: Error): void => {
        emit('google-pie-chart-error', {
          message: mapToString(err),
        });
      }}
    />
  );
}
