import {
  MetricName as WorkerMetricName,
  type Handler,
  type MetricDimensions,
} from '@quisido/worker';
import { PUBLIC } from './constants/metric-dimensions.js';
import { MetricName } from './constants/metric-name.js';
import isWorkerMetricName from './utils/is-worker-metric-name.js';
import mapDimensionsToString from './utils/map-dimensions-to-string.js';

export default function handleMetric(
  this: Handler,
  name: string,
  dimensions: MetricDimensions,
  isPublic?: boolean,
): void {
  if (typeof isPublic === 'undefined') {
    if (isWorkerMetricName(name)) {
      const emitInvalidWorkerMetric = (): void => {
        handleMetric.call(
          this,
          MetricName.InvalidWorkerMetric,
          { dimensions: JSON.stringify(dimensions), name },
          false,
        );
      };

      const emitPrivateMetric = (
        newDimensions: Record<
          number | string | symbol,
          boolean | number | string
        >,
      ): void => {
        handleMetric.call(this, name, newDimensions, false);
      };

      const emitPublicMetric = (
        newDimensions: Record<
          number | string | symbol,
          boolean | number | string
        >,
      ): void => {
        handleMetric.call(this, name, newDimensions, true);
      };

      switch (name) {
        case WorkerMetricName.D1All: {
          const {
            changedDb,
            changes,
            duration,
            endTime,
            env,
            lastRowId,
            query,
            results,
            rowsRead,
            rowsWritten,
            sizeAfter,
            startTime,
          } = dimensions;
          if (
            typeof changedDb !== 'boolean' ||
            typeof changes !== 'number' ||
            typeof duration !== 'number' ||
            typeof endTime !== 'number' ||
            typeof env !== 'string' ||
            typeof lastRowId !== 'number' ||
            typeof query !== 'string' ||
            typeof results !== 'number' ||
            typeof rowsRead !== 'number' ||
            typeof rowsWritten !== 'number' ||
            typeof sizeAfter !== 'number' ||
            typeof startTime !== 'number'
          ) {
            emitInvalidWorkerMetric();
            return;
          }

          emitPrivateMetric({
            changedDb,
            changes,
            duration,
            endTime,
            env,
            lastRowId,
            query,
            results,
            rowsRead,
            rowsWritten,
            sizeAfter,
            startTime,
          });

          emitPublicMetric({
            changedDb,
            changes,
            duration,
            endTime,
            env,
            results,
            rowsRead,
            rowsWritten,
            sizeAfter,
            startTime,
          });
          return;
        }
        case WorkerMetricName.D1Error: {
          const { endTime, env, query, startTime } = dimensions;
          if (
            typeof endTime !== 'number' ||
            typeof env !== 'string' ||
            typeof query !== 'string' ||
            typeof startTime !== 'number'
          ) {
            emitInvalidWorkerMetric();
            return;
          }

          emitPrivateMetric({
            endTime,
            env,
            query,
            startTime,
          });

          emitPublicMetric({
            endTime,
            env,
            startTime,
          });
          return;
        }

        case WorkerMetricName.D1Run: {
          const {
            changedDb,
            changes,
            duration,
            endTime,
            env,
            lastRowId,
            query,
            rowsRead,
            rowsWritten,
            sizeAfter,
            startTime,
          } = dimensions;
          if (
            typeof changedDb !== 'boolean' ||
            typeof changes !== 'number' ||
            typeof duration !== 'number' ||
            typeof endTime !== 'number' ||
            typeof env !== 'string' ||
            typeof lastRowId !== 'number' ||
            typeof query !== 'string' ||
            typeof rowsRead !== 'number' ||
            typeof rowsWritten !== 'number' ||
            typeof sizeAfter !== 'number' ||
            typeof startTime !== 'number'
          ) {
            emitInvalidWorkerMetric();
            return;
          }

          emitPrivateMetric({
            changedDb,
            changes,
            duration,
            endTime,
            env,
            lastRowId,
            query,
            rowsRead,
            rowsWritten,
            sizeAfter,
            startTime,
          });

          emitPublicMetric({
            changedDb,
            changes,
            duration,
            endTime,
            env,
            rowsRead,
            rowsWritten,
            sizeAfter,
            startTime,
          });
          return;
        }

        case WorkerMetricName.Fetch: {
          const { endTime, startTime, url } = dimensions;
          if (
            typeof endTime !== 'number' ||
            typeof startTime !== 'number' ||
            typeof url !== 'string'
          ) {
            emitInvalidWorkerMetric();
            return;
          }

          try {
            const { origin } = new URL(url);
            emitPrivateMetric({ endTime, startTime, url });
            emitPublicMetric({ endTime, origin, startTime });
            return;
          } catch (_err: unknown) {
            emitInvalidWorkerMetric();
            return;
          }
        }

        case WorkerMetricName.InvalidBinding: {
          const { key, type, value } = dimensions;
          if (
            typeof key !== 'string' ||
            typeof type !== 'string' ||
            typeof value !== 'string'
          ) {
            emitInvalidWorkerMetric();
            return;
          }

          emitPrivateMetric({ key, value });
          emitPublicMetric({ key, type });
          return;
        }

        case WorkerMetricName.KVGet: {
          const { endTime, key, namespace, startTime } = dimensions;
          if (
            typeof endTime !== 'number' ||
            typeof key !== 'string' ||
            typeof namespace !== 'string' ||
            typeof startTime !== 'number'
          ) {
            emitInvalidWorkerMetric();
            return;
          }

          emitPrivateMetric({ endTime, key, namespace, startTime });
          emitPublicMetric({ endTime, namespace, startTime });
          return;
        }

        case WorkerMetricName.KVGetError: {
          const { endTime, env, startTime } = dimensions;
          if (
            typeof endTime !== 'number' ||
            typeof env !== 'string' ||
            typeof startTime !== 'number'
          ) {
            emitInvalidWorkerMetric();
            return;
          }

          emitPublicMetric({ endTime, env, startTime });
          return;
        }

        case WorkerMetricName.KVPut: {
          const { endTime, env, startTime } = dimensions;
          if (
            typeof endTime !== 'number' ||
            typeof env !== 'string' ||
            typeof startTime !== 'number'
          ) {
            emitInvalidWorkerMetric();
            return;
          }

          emitPublicMetric({ endTime, env, startTime });
          return;
        }

        case WorkerMetricName.KVPutError: {
          const { endTime, env, startTime } = dimensions;
          if (
            typeof endTime !== 'number' ||
            typeof env !== 'string' ||
            typeof startTime !== 'number'
          ) {
            emitInvalidWorkerMetric();
            return;
          }

          emitPublicMetric({ endTime, env, startTime });
          return;
        }

        case WorkerMetricName.R2Put: {
          const { endTime, env, startTime } = dimensions;
          if (
            typeof endTime !== 'number' ||
            typeof env !== 'string' ||
            typeof startTime !== 'number'
          ) {
            emitInvalidWorkerMetric();
            return;
          }

          emitPublicMetric({ endTime, env, startTime });
          return;
        }

        case WorkerMetricName.R2PutError: {
          const { endTime, env, startTime } = dimensions;
          if (
            typeof endTime !== 'number' ||
            typeof env !== 'string' ||
            typeof startTime !== 'number'
          ) {
            emitInvalidWorkerMetric();
            return;
          }

          emitPublicMetric({ endTime, env, startTime });
          return;
        }
      }
    }

    if (!Object.hasOwn(dimensions, PUBLIC)) {
      this.logError(
        new Error('Attempted to emit a metric without explicit accessibility.'),
      );
      return;
    }

    const { [PUBLIC]: newIsPublic, ...newDimensions } = dimensions;
    if (typeof newIsPublic !== 'boolean') {
      this.logError(
        new Error('Attempted to emit a metric with invalid accessibility.'),
      );
      return;
    }

    handleMetric.call(this, name, newDimensions, newIsPublic);
    return;
  }

  // Public metric
  const dimensionsStr: string = mapDimensionsToString(dimensions);
  if (isPublic) {
    if (dimensionsStr === '{}') {
      this.log('Public metric:', name);
    } else {
      this.log('Public metric:', name, dimensionsStr);
    }

    this.writeMetricDataPoint('PUBLIC_DATASET', name, dimensions);
    return;
  }

  // Private metric
  if (dimensionsStr === '{}') {
    this.log('Private metric:', name);
  } else {
    this.log('Private metric:', name, dimensionsStr);
  }

  this.writeMetricDataPoint('PRIVATE_DATASET', name, dimensions);
}
