import { describe, expect, it } from 'vitest';
import stripUndefinedValues from './strip-undefined-values.js';

describe('stripUndefinedValues', (): void => {
  it('should strip undefined values', (): void => {
    expect(
      stripUndefinedValues({
        abc: undefined,
        def: 'str',
      }),
    ).toEqual({
      def: 'str',
    });
  });
});
