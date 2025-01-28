import type { datadogRum } from '@datadog/browser-rum';
import { renderHook } from '@testing-library/react';
import { StrictMode, type PropsWithChildren, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import DatadogRumContext from '../contexts/datadog-rum.js';
import useDatadog from '../index.js';
import type User from '../types/user.js';

const TEST_CLEAR_USER = vi.fn();
const TEST_INIT = vi.fn();
const TEST_SET_USER = vi.fn();
const TEST_START_SESSION_REPLAY_RECORDING = vi.fn();
const TEST_STOP_SESSION_REPLAY_RECORDING = vi.fn();
const TWICE = 2;

const TEST_RUM: typeof datadogRum = {
  addAction: vi.fn(),
  addDurationVital: vi.fn(),
  addError: vi.fn(),
  addFeatureFlagEvaluation: vi.fn(),
  addTiming: vi.fn(),
  clearGlobalContext: vi.fn(),
  clearUser: TEST_CLEAR_USER,
  getGlobalContext: vi.fn(),
  getInitConfiguration: vi.fn(),
  getInternalContext: vi.fn(),
  getSessionReplayLink: vi.fn(),
  getUser: vi.fn(),
  init: TEST_INIT,
  onReady: vi.fn(),
  removeGlobalContextProperty: vi.fn(),
  removeUserProperty: vi.fn(),
  setGlobalContext: vi.fn(),
  setGlobalContextProperty: vi.fn(),
  setTrackingConsent: vi.fn(),
  setUser: TEST_SET_USER,
  setUserProperty: vi.fn(),
  setViewContext: vi.fn(),
  setViewContextProperty: vi.fn(),
  setViewName: vi.fn(),
  startDurationVital: vi.fn(),
  startSessionReplayRecording: TEST_START_SESSION_REPLAY_RECORDING,
  startView: vi.fn() as (typeof datadogRum)['startView'],
  stopDurationVital: vi.fn(),
  stopSession: vi.fn(),
  stopSessionReplayRecording: TEST_STOP_SESSION_REPLAY_RECORDING,
  version: '0.0.0',
};

const TEST_USER: User = {
  email: 'foo@bar.com',
  id: 'test-id',
  name: 'test-name',
};

function Wrapper({ children }: Readonly<PropsWithChildren>): ReactElement {
  return (
    <StrictMode>
      <DatadogRumContext.Provider value={TEST_RUM}>
        {children}
      </DatadogRumContext.Provider>
    </StrictMode>
  );
}

describe('useDatadog', (): void => {
  it('should call `init`', (): void => {
    renderHook(useDatadog, {
      wrapper: Wrapper,

      initialProps: {
        applicationId: 'test-application-id',
        clientToken: 'test-client-token',
      },
    });

    expect(TEST_INIT).toHaveBeenCalledOnce();
    expect(TEST_INIT).toHaveBeenLastCalledWith({
      applicationId: 'test-application-id',
      clientToken: 'test-client-token',
      silentMultipleInit: true,
      site: 'datadoghq.com',
    });
  });

  it('should not call `init` if `enabled` is false', (): void => {
    renderHook(useDatadog, {
      wrapper: Wrapper,

      initialProps: {
        applicationId: 'test-application-id',
        clientToken: 'test-client-token',
        enabled: false,
      },
    });

    expect(TEST_INIT).not.toHaveBeenCalled();
  });

  it('should call `init` if the configuration has changed', (): void => {
    const { rerender } = renderHook(useDatadog, {
      wrapper: Wrapper,

      initialProps: {
        applicationId: 'test-application-id',
        clientToken: 'test-client-token',
        version: 'test-version-1',
      },
    });

    rerender({
      applicationId: 'test-application-id',
      clientToken: 'test-client-token',
      version: 'test-version-2',
    });

    expect(TEST_INIT).toHaveBeenCalledTimes(TWICE);
  });

  it('should start session replay recording on mount', (): void => {
    renderHook(useDatadog, {
      wrapper: Wrapper,

      initialProps: {
        applicationId: 'test-application-id',
        clientToken: 'test-client-token',
      },
    });

    expect(TEST_START_SESSION_REPLAY_RECORDING).toHaveBeenCalledTimes(TWICE);
    expect(TEST_START_SESSION_REPLAY_RECORDING).toHaveBeenLastCalledWith();
  });

  it('should not start session replay recording when `enabled` is false', (): void => {
    renderHook(useDatadog, {
      wrapper: Wrapper,

      initialProps: {
        applicationId: 'test-application-id',
        clientToken: 'test-client-token',
        enabled: false,
      },
    });

    expect(TEST_START_SESSION_REPLAY_RECORDING).not.toHaveBeenCalled();
  });

  it('should not start session replay recording when `sessionReplayRecording` is false', (): void => {
    renderHook(useDatadog, {
      wrapper: Wrapper,

      initialProps: {
        applicationId: 'test-application-id',
        clientToken: 'test-client-token',
        sessionReplayRecording: false,
      },
    });

    expect(TEST_START_SESSION_REPLAY_RECORDING).not.toHaveBeenCalled();
  });

  it('should stop session replay recording on unmount', (): void => {
    const { unmount } = renderHook(useDatadog, {
      wrapper: Wrapper,

      initialProps: {
        applicationId: 'test-application-id',
        clientToken: 'test-client-token',
      },
    });

    unmount();

    expect(TEST_STOP_SESSION_REPLAY_RECORDING).toHaveBeenCalledTimes(TWICE);
    expect(TEST_STOP_SESSION_REPLAY_RECORDING).toHaveBeenLastCalledWith();
  });

  it('should not set the user when not provided', (): void => {
    renderHook(useDatadog, {
      wrapper: Wrapper,

      initialProps: {
        applicationId: 'test-application-id',
        clientToken: 'test-client-token',
      },
    });

    expect(TEST_SET_USER).not.toHaveBeenCalled();
  });

  it('should set the user when provided', (): void => {
    renderHook(useDatadog, {
      wrapper: Wrapper,

      initialProps: {
        applicationId: 'test-application-id',
        clientToken: 'test-client-token',
        user: TEST_USER,
      },
    });

    expect(TEST_SET_USER).toHaveBeenCalledTimes(TWICE);
    expect(TEST_SET_USER).toHaveBeenLastCalledWith(TEST_USER);
  });

  it('should remove the user on unmount', (): void => {
    const { unmount } = renderHook(useDatadog, {
      wrapper: Wrapper,

      initialProps: {
        applicationId: 'test-application-id',
        clientToken: 'test-client-token',
        user: TEST_USER,
      },
    });

    unmount();

    expect(TEST_CLEAR_USER).toHaveBeenCalledTimes(TWICE);
  });
});
