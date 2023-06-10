import QUERIES from '../queries';
import type CfJson from '../types/cf-json';
import type Env from '../types/env';
import type Result from '../types/result';
import mapResultToCost from '../utils/map-result-to-cost';
import mapResultsToCfJson from '../utils/map-results-to-cf-json';
import mapUnknownToString from '../utils/map-unknown-to-string';
import QueryEngine from '../utils/query-engine';
import sum from '../utils/sum';
import validateResult from '../utils/validate-result';

const NONE = 0;

export default async function scheduled(
  { scheduledTime }: Pick<ScheduledEvent, 'scheduledTime'>,
  { ACCOUNT_TAG, API_TOKEN, ERRORS, RESULTS, SCHEDULED, ZONE_TAG }: Env,
  cxt: ExecutionContext,
): Promise<void> {
  if (typeof ACCOUNT_TAG !== 'string') {
    throw new Error('Missing `ACCOUNT_TAG` variable.');
  }

  if (typeof API_TOKEN !== 'string') {
    throw new Error('Missing `API_TOKEN` variable.');
  }

  if (typeof ZONE_TAG !== 'string') {
    throw new Error('Missing `ZONE_TAG` variable.');
  }

  const start: Date = new Date(scheduledTime);
  try {
    const engine: QueryEngine = new QueryEngine(
      API_TOKEN,
      ACCOUNT_TAG,
      ZONE_TAG,
      start,
    );

    const mapQueryToResult = async (query: string): Promise<Result> => {
      const response: Response = await engine.fetch(query);
      const json: unknown = await response.json();
      return validateResult(json);
    };

    const results: readonly Result[] = await Promise.all(
      QUERIES.map(mapQueryToResult),
    );

    const body: CfJson = mapResultsToCfJson(results);
    const costs: readonly number[] = results.map(mapResultToCost);

    const cost: number = costs.reduce(sum, NONE);
    if (typeof RESULTS !== 'undefined') {
      cxt.waitUntil(RESULTS.put('cf.json', JSON.stringify(body)));
    }

    if (typeof SCHEDULED !== 'undefined') {
      const duration: number = start.getTime() - Date.now();
      SCHEDULED.writeDataPoint({
        doubles: [duration, body.budget, cost],
      });
    }
  } catch (err: unknown) {
    console.error(err);

    if (typeof ERRORS === 'undefined') {
      return;
    }

    const duration: number = start.getTime() - Date.now();
    const message: string = mapUnknownToString(err);
    ERRORS.writeDataPoint({
      blobs: [message],
      doubles: [duration],
    });
  }
}