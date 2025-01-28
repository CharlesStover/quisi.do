import configs, { disableRulesForFiles } from '@quisido/eslint-config';

export default [
  ...configs,

  ...disableRulesForFiles({
    complexity: ['src/features/handle-fetch.ts', 'src/handle-metric.ts'],
    'max-params': ['src/handle-metric.ts'],

    'max-lines': [
      'src/datadog-aggregate-rum-events/datadog-rum-api.ts',
      'src/handle-metric.ts',
    ],

    'max-lines-per-function': [
      'src/features/handle-fetch.ts',
      'src/datadog-aggregate-rum-events/datadog-rum-api.ts',
      'src/datadog-aggregate-rum-events/get-datadog-aggregate-rum-events.ts',
      'src/handle-metric.ts',
    ],

    'max-statements': [
      'src/datadog-aggregate-rum-events/get-datadog-aggregate-rum-events.ts',
      'src/features/handle-fetch.ts',
      'src/handle-metric.ts',
    ],
  }),
];
