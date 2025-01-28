import type { ErrorCode } from '@quisido/authn-shared';
import { ResponseInitImpl, StatusCode } from 'cloudflare-utils';

interface Options {
  readonly code: ErrorCode;
  readonly host: string;
  readonly returnPath?: string | undefined;
}

export default class FatalOAuthErrorResponseInit extends ResponseInitImpl {
  public constructor({ code, host, returnPath = '/' }: Options) {
    const location = `https://${host}${returnPath}#authn:error=${code.toString()}`;

    super({
      status: StatusCode.SeeOther,

      headers: new Headers({
        'content-location': location,
        location,
      }),
    });
  }
}
