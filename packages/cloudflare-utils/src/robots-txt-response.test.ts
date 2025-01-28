import { describe, expect, it } from 'vitest';
import { RobotsTxtResponse, StatusCode } from './index.js';

describe('RobotsTxtResponse', (): void => {
  it('should set appropriate headers', (): void => {
    const { headers } = new RobotsTxtResponse();
    expect(headers.get('access-control-max-age')).not.toBeNull();
    expect(headers.get('cache-control')).not.toBeNull();
  });

  it('should respect existing cache headers', (): void => {
    const { headers } = new RobotsTxtResponse({
      headers: new Headers({
        'access-control-max-age': '0',
        'cache-control': 'test',
      }),
    });

    expect(headers.get('access-control-max-age')).toBe('0');
    expect(headers.get('cache-control')).toBe('test');
  });

  it('should set custom init', (): void => {
    const { status } = new RobotsTxtResponse({
      status: StatusCode.InternalServerError,
    });

    expect(status).toBe(StatusCode.InternalServerError);
  });
});
