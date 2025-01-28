import type { Chart } from './chart.js';

export type ChartOptions<C extends Chart> = Parameters<
  (typeof google.visualization)[C]['prototype']['draw']
>[1];
