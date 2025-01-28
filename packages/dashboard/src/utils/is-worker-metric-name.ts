import { MetricName as WorkerMetricName } from '@quisido/worker';

const NAMES = new Set<unknown>(Object.values(WorkerMetricName));

export default function isWorkerMetricName(
  value: unknown,
): value is WorkerMetricName {
  return NAMES.has(value);
}
