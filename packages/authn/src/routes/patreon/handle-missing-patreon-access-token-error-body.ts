import { ErrorCode } from '@quisido/authn-shared';
import { MetricName } from '../../constants/metric-name.js';
import { emitPublicMetric } from '../../constants/worker.js';
import FatalError from '../../utils/fatal-error.js';

export default function handleMissingPatreonAccessTokenErrorBody(): never {
  emitPublicMetric({ name: MetricName.MissingPatreonAccessTokenErrorBody });
  throw new FatalError(ErrorCode.MissingPatreonAccessTokenErrorBody);
}
