import { StatusCode } from 'cloudflare-utils';
import { describe, it } from 'vitest';
import { MetricName } from '../constants/metric-name.js';
import TestAuthnExportedHandler from '../test/test-authn-exported-handler.js';

describe('handleStaticPathname', (): void => {
  describe('root', (): void => {
    it('should emit and respond', async (): Promise<void> => {
      // Assemble
      const { expectToHaveEmitPublicMetric, fetch } =
        new TestAuthnExportedHandler();

      // Act
      const { expectHeadersToBe, expectStatusCodeToBe } = await fetch('/');

      // Assert
      expectToHaveEmitPublicMetric(MetricName.RootPathname);
      expectStatusCodeToBe(StatusCode.PermanentRedirect);
      expectHeadersToBe({
        location: `https://host.test.quisi.do/`,
      });
    });
  });

  describe('favicon.ico', (): void => {
    it('should emit and respond', async (): Promise<void> => {
      // Assemble
      const { expectToHaveEmitPublicMetric, fetch } =
        new TestAuthnExportedHandler();

      // Act
      const { expectHeadersToBe, expectStatusCodeToBe } =
        await fetch('/favicon.ico');

      // Assert
      expectToHaveEmitPublicMetric(MetricName.FaviconIco);
      expectStatusCodeToBe(StatusCode.OK);
      expectHeadersToBe({
        'access-control-max-age': '31536000',
        'cache-control': 'immutable, max-age=31536000, public',
        'content-type': 'image/x-icon; charset=utf-8',
      });
    });
  });

  describe('robots.txt', (): void => {
    it('should emit and respond', async (): Promise<void> => {
      // Assemble
      const { expectToHaveEmitPublicMetric, fetch } =
        new TestAuthnExportedHandler();

      // Act
      const { expectHeadersToBe, expectStatusCodeToBe } =
        await fetch('/robots.txt');

      // Assert
      expectToHaveEmitPublicMetric(MetricName.RobotsTxt);
      expectStatusCodeToBe(StatusCode.OK);
      expectHeadersToBe({
        'access-control-max-age': '31536000',
        'cache-control': 'immutable, max-age=31536000, public',
        'content-type': 'text/plain; charset=utf-8',
      });
    });
  });
});
