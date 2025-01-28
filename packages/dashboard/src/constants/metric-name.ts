export enum MetricName {
  DatadogAggregateRumEventsCached = 'datadog.rum.events.aggregate.cached',
  DatadogAggregateRumEventsUncached = 'datadog.rum.events.aggregate.uncached',
  ExpiredDatadogAggregateRumEvents = 'datadog.rum.events.aggregate.expired',
  InvalidWorkerMetric = '@quisido/worker:invalid-metric',
  MissingDatadogAggregateRumEventsCacheExpiry = 'datadog.rum.events.aggregate.cache.expiry.missing',
  MissingDatadogAggregateRumEventsCacheMetadata = 'datadog.rum.events.aggregate.cache.metadata.missing',
  MissingDatadogRumMetric = 'datadog.rum.metric.missing',
}
