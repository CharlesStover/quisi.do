const BODY: BodyInit =
  '%00%00%01%00%01%00%01%01%00%00%01%00%20%000%00%00%00%16%00%00%00(%00%00%00%01%00%00%00%02%00%00%00%01%00%20%00%00%00%00%00%08%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00%00';

export default class TransparentIcoResponse extends Response {
  public constructor({ headers, ...init }: ResponseInit = {}) {
    const newHeaders = new Headers(headers);
    newHeaders.set('content-type', 'image/x-icon; charset=utf-8');

    super(BODY, {
      ...init,
      headers: newHeaders,
    });
  }
}
