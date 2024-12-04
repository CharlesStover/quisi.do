import type { ErrorCode } from '@quisido/authn-shared';
import { StatusCode } from 'cloudflare-utils';
import { sortEntriesByKey } from 'fmrs';
import { expect } from 'vitest';

export default class TestResponse {
  public static async from(response: Response): Promise<TestResponse> {
    const text: string = await response.text();
    return new TestResponse(response, text);
  }

  readonly #response: Response;
  readonly #text: string;

  private constructor(response: Response, text: string) {
    this.#response = response;
    this.#text = text;
  }

  expectBodyToBe = (
    body: Record<string, boolean | number | string> | string,
  ): void => {
    if (typeof body === 'string') {
      expect(this.#text).toBe(body);
    } else {
      expect(JSON.parse(this.#text)).toEqual(body);
    }
  };

  expectErrorResponse = (code: ErrorCode, returnPath = '/'): void => {
    const codeStr: string = code.toString();

    this.expectNoBody();
    this.expectStatusCodeToBe(StatusCode.SeeOther);
    this.expectHeadersToBe({
      'access-control-allow-methods': 'GET',
      allow: 'GET',
      'content-location': `https://host.test.quisi.do${returnPath}#authn:error=${codeStr}`,
      location: `https://host.test.quisi.do${returnPath}#authn:error=${codeStr}`,
    });
  };

  expectHeadersToBe = (headers: Record<string, string>): void => {
    expect(this.#headerEntries).toEqual(
      Object.entries(headers).sort(sortEntriesByKey),
    );
  };

  expectNoBody = (): void => {
    expect(this.#text).toBe('');
  };

  expectStatusCodeToBe = (code: number): void => {
    expect(this.#response.status).toBe(code);
  };

  get #headerEntries(): readonly (readonly [string, string])[] {
    return [...this.#response.headers.entries()].sort(sortEntriesByKey);
  }
}