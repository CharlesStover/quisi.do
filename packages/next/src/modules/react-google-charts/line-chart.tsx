import { type ReactElement } from 'react';
import GoogleChart from './google-chart.jsx';

interface Props extends google.visualization.LineChartOptions {
  readonly data: readonly (readonly (number | string)[])[];
  readonly headings?: readonly string[] | undefined;
  readonly onError?: ((error: Error) => void) | undefined;
}

export default function LineChart({
  data,
  headings,
  onError,
  ...options
}: Props): ReactElement {
  return (
    <GoogleChart
      chart="LineChart"
      data={data}
      headings={headings}
      onError={onError}
      options={options}
      packages={['corechart']}
    />
  );
}
