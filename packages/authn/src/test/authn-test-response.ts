import type { ErrorCode } from '@quisido/authn-shared';
import { TestResponse } from '@quisido/worker-test';
import { expectStringMatching } from 'cloudflare-test-utils';
import { StatusCode } from 'cloudflare-utils';

export default class AuthnTestResponse implements TestResponse {
  public readonly expectBodyToBe: TestResponse['expectBodyToBe'];
  public readonly expectHeaderToBe: TestResponse['expectHeaderToBe'];
  public readonly expectHeadersToBe: TestResponse['expectHeadersToBe'];
  public readonly expectJsonErrorResponse: (code: ErrorCode) => void;
  public readonly expectNoBody: TestResponse['expectNoBody'];
  public readonly expectOAuthSuccessResponse: () => void;
  public readonly expectStatusCodeToBe: TestResponse['expectStatusCodeToBe'];

  public readonly expectOAuthErrorResponse: (
    code: ErrorCode,
    returnPath?: string,
  ) => void;

  public constructor(testResponse: TestResponse) {
    this.expectBodyToBe = testResponse.expectBodyToBe.bind(testResponse);
    this.expectHeaderToBe = testResponse.expectHeaderToBe.bind(testResponse);
    this.expectHeadersToBe = testResponse.expectHeadersToBe.bind(testResponse);
    this.expectNoBody = testResponse.expectNoBody.bind(testResponse);
    this.expectStatusCodeToBe =
      testResponse.expectStatusCodeToBe.bind(testResponse);

    this.expectJsonErrorResponse = (code: ErrorCode): void => {
      testResponse.expectBodyToBe({
        error: code,
      });
    };

    this.expectOAuthErrorResponse = (
      code: ErrorCode,
      returnPath = '/',
    ): void => {
      testResponse.expectNoBody();
      testResponse.expectStatusCodeToBe(StatusCode.SeeOther);

      const codeStr: string = code.toString();
      testResponse.expectHeadersToBe({
        'content-location': `https://host.test.quisi.do${returnPath}#authn:error=${codeStr}`,
        location: `https://host.test.quisi.do${returnPath}#authn:error=${codeStr}`,
      });
    };

    this.expectOAuthSuccessResponse = (): void => {
      testResponse.expectNoBody();
      testResponse.expectStatusCodeToBe(StatusCode.SeeOther);
      testResponse.expectHeadersToBe({
        'content-location': `https://host.test.quisi.do/test-return-path/`,
        location: `https://host.test.quisi.do/test-return-path/`,
        'set-cookie': expectStringMatching(
          /^__Secure-Authentication-ID=.{64}; Domain=quisi.do; Max-Age=86400; Partitioned; Path=\/; SameSite=Lax; Secure$/u,
        ),
      });
    };
  }
}
