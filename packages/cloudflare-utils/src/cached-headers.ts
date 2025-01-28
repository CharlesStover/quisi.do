export default class CachedHeaders extends Headers {
  public constructor(init: HeadersInit | undefined) {
    super(init);

    if (!this.has('access-control-max-age')) {
      this.set('access-control-max-age', '31536000');
    }

    if (!this.has('cache-control')) {
      this.set('cache-control', 'immutable, max-age=31536000, public');
    }
  }
}
