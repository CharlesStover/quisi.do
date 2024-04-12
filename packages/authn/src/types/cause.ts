import type ErrorCode from '../constants/error-code.js';

// All `Error`s in this package are required to contain a `cause` in this shape.
export default interface Cause {
  readonly code: ErrorCode;
  readonly privateData?: unknown;
  readonly publicData?: unknown;
}
