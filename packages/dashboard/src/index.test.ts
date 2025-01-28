import { describe, expect, it } from 'vitest';
import exportedHandler from './index.js';

describe('exportedHandler', (): void => {
  it('should have a fetch method', (): void => {
    expect(exportedHandler).toHaveProperty('fetch');
  });
});
