import mapDimensionsToDataPoint from './map-dimensions-to-datapoint.js';

export default function mapAnalyticsEngineDatasetToEmitter<
  M extends Record<'name', string> & Partial<Record<string, number | string>>,
>(dataset: AnalyticsEngineDataset): (metric: M) => void {
  return function emit({ name, ...dimensions }: M): void {
    dataset.writeDataPoint({
      ...mapDimensionsToDataPoint(dimensions),
      indexes: [name],
    });
  };
}
