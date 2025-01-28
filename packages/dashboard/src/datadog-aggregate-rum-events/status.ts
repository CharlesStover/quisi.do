import type { UnparsedObject } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-common/util.js';
import type { RUMResponseStatus } from '@datadog/datadog-api-client/dist/packages/datadog-api-client-v2/index.js';

export type Status =
  | Exclude<RUMResponseStatus, UnparsedObject>
  | 'unknown'
  | 'unparsed';
