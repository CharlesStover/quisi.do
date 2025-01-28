import { StatusCode } from 'cloudflare-utils';
import OptionsResponseHeaders from './options-response-headers.js';

export default class OptionsResponse extends Response {
  public constructor(accessControlAllowOrigin: string) {
    super(null, {
      headers: new OptionsResponseHeaders(accessControlAllowOrigin),
      status: StatusCode.OK,
    });
  }
}
