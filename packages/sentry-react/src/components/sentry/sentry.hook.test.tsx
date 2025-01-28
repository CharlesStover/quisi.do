import type { User } from '@sentry/react';
import { renderHook } from '@testing-library/react';
import type { PropsWithChildren, ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { MockSentrySdk } from '../../index.js';
import useSentry from './sentry.hook.js';

const TEST_BEFORE_BREADCRUMB = vi.fn();
const TEST_BEFORE_SEND = vi.fn();
const TEST_INIT = vi.fn();
const TEST_SET_USER = vi.fn();
const TEST_TRACES_SAMPLER = vi.fn();
const TEST_TRANSPORT = vi.fn();

function Wrapper({ children }: PropsWithChildren): ReactElement {
  return (
    <MockSentrySdk init={TEST_INIT} setUser={TEST_SET_USER}>
      {children}
    </MockSentrySdk>
  );
}

describe('useSentry', (): void => {
  it('should call init', (): void => {
    renderHook(useSentry, {
      wrapper: Wrapper,

      initialProps: {
        allowUrls: [],
        attachStacktrace: true,
        autoSessionTracking: true,
        beforeBreadcrumb: TEST_BEFORE_BREADCRUMB,
        beforeSend: TEST_BEFORE_SEND,
        debug: true,
        defaultIntegrations: false,
        denyUrls: [],
        dist: 'test-dist',
        dsn: 'test-dsn',
        enabled: true,
        environment: 'test-environment',
        ignoreErrors: [],
        initialScope: {},
        integrations: [],
        maxBreadcrumbs: 1,
        maxValueLength: 1,
        normalizeDepth: 1,
        release: 'test-release',
        sampleRate: 1,
        shutdownTimeout: 1,
        tracesSampleRate: 1,
        tracesSampler: TEST_TRACES_SAMPLER,
        transport: TEST_TRANSPORT,
        tunnel: 'test-tunnel',
      },
    });

    expect(TEST_INIT).toHaveBeenCalledOnce();
    expect(TEST_INIT).toHaveBeenLastCalledWith({
      allowUrls: [],
      attachStacktrace: true,
      autoSessionTracking: true,
      beforeBreadcrumb: TEST_BEFORE_BREADCRUMB,
      beforeSend: TEST_BEFORE_SEND,
      debug: true,
      defaultIntegrations: false,
      denyUrls: [],
      dist: 'test-dist',
      dsn: 'test-dsn',
      enabled: true,
      environment: 'test-environment',
      ignoreErrors: [],
      initialScope: {},
      integrations: [],
      maxBreadcrumbs: 1,
      maxValueLength: 1,
      normalizeDepth: 1,
      release: 'test-release',
      sampleRate: 1,
      shutdownTimeout: 1,
      tracesSampleRate: 1,
      tracesSampler: TEST_TRACES_SAMPLER,
      transport: TEST_TRANSPORT,
      tunnel: 'test-tunnel',
    });
  });

  it('should support a default user', (): void => {
    renderHook(useSentry, {
      wrapper: Wrapper,

      initialProps: {
        dsn: 'test-dsn',
      },
    });

    expect(TEST_SET_USER).toHaveBeenCalledOnce();
    expect(TEST_SET_USER).toHaveBeenLastCalledWith({
      ip_address: '{{auto}}',
    });
  });

  it('should support an explicit user', (): void => {
    const TEST_USER: User = {
      id: 'test-id',
      ip_address: '{{auto}}',
    };

    renderHook(useSentry, {
      wrapper: Wrapper,

      initialProps: {
        dsn: 'test-dsn',
        user: TEST_USER,
      },
    });

    expect(TEST_SET_USER).toHaveBeenCalledOnce();
    expect(TEST_SET_USER).toHaveBeenLastCalledWith(TEST_USER);
  });
});
