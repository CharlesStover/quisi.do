import ErrorCode from '../constants/error-code.js';
import MetricName from '../constants/metric-name.js';
import expectResponseToRedirectTo from '../test/expect-response-to-redirect-to.js';
import withTestState from '../test/with-test-state.js';
import handleFetchError from './handle-fetch-error.js';

const TEST_ERROR: Error = new Error('test message', { cause: 'test cause' });

describe('handleInvalidFetchErrorCause', (): void => {
  it('should emit telemetry', (): void => {
    const { expectPrivateError, expectPublicDataPoint } = withTestState(
      (): Response => handleFetchError(TEST_ERROR),
    );

    expectPrivateError(TEST_ERROR);
    expectPublicDataPoint({
      blobs: ['0123456789abcdef0123456789abcdef', '0000000000000000'],
      doubles: [ErrorCode.InvalidCause, expect.any(Number) as number, 0, 0],
      indexes: [MetricName.ErrorCode],
    });
  });

  it('should return the correct error code', (): void => {
    const { result } = withTestState(
      (): Response => handleFetchError(TEST_ERROR),
    );

    expectResponseToRedirectTo(
      result,
      `https://localhost/#authn:error=${ErrorCode.InvalidCause}`,
    );
  });
});
