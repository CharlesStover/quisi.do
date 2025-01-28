export default interface DashboardApiResponse {
  readonly cls: readonly [number, number];
  readonly dcl: readonly [number, number];
  readonly domComplete: readonly [number, number];
  readonly errorCount: readonly [number, number, number];
  readonly fcp: readonly [number, number];
  readonly fip: readonly [number, number];
  readonly inp: readonly [number, number];
  readonly lcp: readonly [number, number];
  readonly loadEvent: readonly [number, number];
  readonly loadingTime: readonly [number, number];
  readonly sessionTimeSpent: number;
  readonly ttfb: readonly [number, number];
  readonly viewTimeSpent: number;
}
