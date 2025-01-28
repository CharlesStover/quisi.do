/// <reference types="@cloudflare/workers-types" />
import { vi } from 'vitest';

export const TEST_PASS_THROUGH_ON_EXCEPTION = vi.fn();
export const TEST_WAIT_UNTIL = vi.fn();

export const TEST_EXECUTION_CONTEXT: ExecutionContext = {
  passThroughOnException: TEST_PASS_THROUGH_ON_EXCEPTION,
  props: null,
  waitUntil: TEST_WAIT_UNTIL,
};
