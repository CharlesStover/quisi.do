import { StatusCode } from 'cloudflare-utils';
import InternalServerErrorResponseHeaders from './internal-server-error-response-headers.js';

const BODY_INIT: BodyInit = JSON.stringify({
  code: 0,
});

export default class InternalServerErrorResponse extends Response {
  public constructor(accessControlAllowOrigin: string) {
    super(BODY_INIT, {
      headers: new InternalServerErrorResponseHeaders(accessControlAllowOrigin),
      status: StatusCode.InternalServerError,
    });
  }
}
