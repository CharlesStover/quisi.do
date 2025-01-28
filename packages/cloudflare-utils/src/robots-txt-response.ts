import CachedHeaders from './cached-headers.js';
import { StatusCode } from './status-code.js';

const BODY: BodyInit = `User-agent: *
Disallow: *`;

export default class RobotsTxtResponse extends Response {
  constructor({ headers, ...init }: ResponseInit = {}) {
    const newHeaders = new CachedHeaders(headers);
    newHeaders.set('content-type', 'text/plain; charset=utf-8');

    super(BODY, {
      status: StatusCode.OK,
      ...init,
      headers: newHeaders,
    });
  }
}
