import { StatusCode } from 'cloudflare-utils';
import { describe, it } from 'vitest';
import { MetricName } from '../constants/metric-name.js';
import TestCspExportedHandler from '../test/test-csp-exported-handler.js';

describe('handleFetchRequest', (): void => {
  it('should handle unallowed methods', async (): Promise<void> => {
    // Assemble
    const { expectToHaveEmitPublicMetric, fetch } =
      new TestCspExportedHandler();

    // Act
    const { expectStatusCodeToBe } = await fetch('/abc/', {
      method: 'TEST',
    });

    // Assert
    expectStatusCodeToBe(StatusCode.MethodNotAllowed);
    expectToHaveEmitPublicMetric(MetricName.MethodNotAllowed, {
      method: 'TEST',
    });
  });

  it('should handle invalid pathnames', async (): Promise<void> => {
    // Assemble
    const { expectToHaveEmitPublicMetric, fetch } =
      new TestCspExportedHandler();

    // Act
    const { expectStatusCodeToBe } = await fetch('//');

    // Assert
    expectStatusCodeToBe(StatusCode.NotFound);
    expectToHaveEmitPublicMetric(MetricName.InvalidPathname, {
      pathname: '//',
    });
  });
});
