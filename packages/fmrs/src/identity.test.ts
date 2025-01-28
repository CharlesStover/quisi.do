import { describe, expect, it } from 'vitest';
import { identity } from './index.js';

const TEST_NUMBER = 1234;
const TEST_OBJECT = { key: 'value' };

describe('identity', (): void => {
  it('should return itself', (): void => {
    expect(identity(true)).toBe(true);
    expect(identity(TEST_NUMBER)).toBe(TEST_NUMBER);
    expect(identity('str')).toBe('str');
    expect(identity(TEST_OBJECT)).toBe(TEST_OBJECT);
  });
});
