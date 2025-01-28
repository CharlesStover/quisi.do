import { describe, expect, it } from 'vitest';
import {
  FaviconIcoResponse,
  StatusCode,
  TransparentIcoResponse,
} from './index.js';

describe('FaviconIcoResponse', (): void => {
  it('should be a transparent icon response', (): void => {
    expect(new FaviconIcoResponse()).toBeInstanceOf(TransparentIcoResponse);
  });

  it('should set cache headers response', (): void => {
    const { headers } = new FaviconIcoResponse();
    expect(headers.get('access-control-max-age')).not.toBeNull();
    expect(headers.get('cache-control')).not.toBeNull();
  });

  it('should respect existing cache headers', (): void => {
    const { headers } = new FaviconIcoResponse({
      headers: new Headers({
        'access-control-max-age': '0',
        'cache-control': 'test',
      }),
    });

    expect(headers.get('access-control-max-age')).toBe('0');
    expect(headers.get('cache-control')).toBe('test');
  });

  it('should set custom init', (): void => {
    const { status } = new FaviconIcoResponse({
      status: StatusCode.InternalServerError,
    });

    expect(status).toBe(StatusCode.InternalServerError);
  });
});
