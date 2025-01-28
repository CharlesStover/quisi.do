import { mapToString } from 'fmrs';
import type { ReactElement } from 'react';
import useEmit from '../hooks/use-emit/use-emit.js';
import { LineChart as GoogleLineChart } from '../modules/react-google-charts/index.js';

interface Props {
  readonly data: readonly (readonly (number | string)[])[];
  readonly headings: readonly string[];
}

export default function PieChart({ data, headings }: Props): ReactElement {
  // Contexts
  const emit = useEmit();

  return (
    <GoogleLineChart
      curveType="function"
      data={data}
      headings={headings}
      onError={(err: Error): void => {
        emit('google-line-chart-error', {
          message: mapToString(err),
        });
      }}
    />
  );
}
