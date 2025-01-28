export default class OptionsResponseHeaders extends Headers {
  public constructor(accessControlAllowOrigin: string) {
    super({
      'access-control-allow-origin': accessControlAllowOrigin,
    });
  }
}
