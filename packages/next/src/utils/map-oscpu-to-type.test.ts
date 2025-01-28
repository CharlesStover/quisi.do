import { OS_TYPE_VALUE_WINDOWS } from '@opentelemetry/semantic-conventions/incubating';
import { describe, expect, it } from 'vitest';
import mapOscpuToType from './map-oscpu-to-type.js';

describe('mapOscpuToType', (): void => {
  it('should support Windows', (): void => {
    for (const oscpu of [
      'Win16',
      'Win95',
      'Win98',
      'WinNT',
      'WinNT4.0',
      'Windows 10.0',
      'Windows_95',
      'Windows NT',
      'Windows NT 5.0',
      'Windows NT 5.1',
      'Windows NT 5.2',
      'Windows NT 6.0',
      'Windows NT 6.1',
      'Windows NT 6.2',
      'Windows NT 10.0',
    ]) {
      expect(mapOscpuToType(oscpu)).toBe(OS_TYPE_VALUE_WINDOWS);
    }
  });
});
