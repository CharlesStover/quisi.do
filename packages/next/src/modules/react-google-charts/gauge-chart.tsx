import { type ReactElement } from 'react';
import GoogleChart from './google-chart.jsx';

interface Props extends google.visualization.GaugeChartOptions {
  readonly className?: string | undefined;
  readonly data: readonly (readonly (number | string)[])[];
  readonly onError?: ((error: Error) => void) | undefined;
}

export default function GaugeChart({
  className,
  data,
  onError,
  ...options
}: Props): ReactElement {
  return (
    <GoogleChart
      chart="Gauge"
      className={className}
      data={data}
      headings={['Label', 'Value']}
      onError={onError}
      options={options}
      packages={['gauge']}
    />
  );
}
