import { StatusCode } from 'cloudflare-utils';
import OkResponseHeaders from './ok-response-headers.js';

interface Options {
  readonly accessControlAllowOrigin: string;
}

export default class OkResponse extends Response {
  public constructor(body: unknown, { accessControlAllowOrigin }: Options) {
    super(JSON.stringify(body), {
      headers: new OkResponseHeaders(accessControlAllowOrigin),
      status: StatusCode.OK,
    });
  }
}
