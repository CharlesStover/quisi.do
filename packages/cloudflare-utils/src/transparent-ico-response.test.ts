import { describe, expect, it } from 'vitest';
import { StatusCode, TransparentIcoResponse } from './index.js';

describe('TransparentIcoResponse', (): void => {
  it('should have the correct body', async (): Promise<void> => {
    const response = new TransparentIcoResponse();
    expect(await response.text()).toMatch(/^(?:%(?:0[0128]|16|20)|[0()\s])+$/u);
  });

  it('should have the correct content-type', (): void => {
    const response = new TransparentIcoResponse();
    expect(response.headers.get('content-type')).toContain('image/x-icon');
  });

  it('should set custom init', (): void => {
    const favicon = new TransparentIcoResponse({
      status: StatusCode.InternalServerError,
    });

    expect(favicon.status).toBe(StatusCode.InternalServerError);
  });
});
