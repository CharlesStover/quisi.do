import { MetricName } from '../constants/metric-name.js';
import { emitPrivateMetric, emitPublicMetric } from '../constants/worker.js';

export default function handleInsertIntoOAuthResponse(
  userId: number,
): (response: D1Response) => void {
  const startTime: number = Date.now();

  return function handleThen({
    meta: { changes, duration, last_row_id: lastRowId, size_after: sizeAfter },
  }: D1Response): void {
    emitPrivateMetric({
      changes,
      duration,
      endTime: Date.now(),
      lastRowId,
      name: MetricName.OAuthInserted,
      sizeAfter,
      startTime,
      userId,
    });

    emitPublicMetric({
      changes,
      duration,
      endTime: Date.now(),
      name: MetricName.OAuthInserted,
      sizeAfter,
      startTime,
    });
  };
}
