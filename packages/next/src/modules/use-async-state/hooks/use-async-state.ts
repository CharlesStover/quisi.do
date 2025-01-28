'use client';

import { mapToString } from 'fmrs';
import { useCallback, useRef, useState, type RefObject } from 'react';
import useEffectEvent from '../../../hooks/use-effect-event.js';
import type AsyncState from '../types/async-state.js';
import useGetState from './use-get-state.js';

interface BaseState<T> {
  readonly asyncEffectRef: RefObject<Promise<void> | undefined>;
  readonly request: (get: () => Promise<T>) => Promise<void>;
  readonly reset: VoidFunction;
  readonly retry: () => Promise<void>;
  readonly set: (data: T) => void;
}

interface Props {
  readonly onError?: ((error: unknown) => void) | undefined;
}

export type State<T> = AsyncState<T> & BaseState<T>;

const DEFAULT_ASYNC_STATE = {
  data: undefined,
  error: undefined,
  initiated: false,
  loading: false,
} satisfies AsyncState<unknown>;

export default function useAsyncState<T = unknown>({
  onError,
}: Props = {}): State<T> {
  // States
  const asyncEffectRef: RefObject<Promise<void> | undefined> =
    useRef(undefined);

  const lastGetRef: RefObject<(() => Promise<T>) | undefined> =
    useRef(undefined);

  const [asyncState, setAsyncState] =
    useState<AsyncState<T>>(DEFAULT_ASYNC_STATE);

  // Callbacks
  const getState = useGetState<T>({
    lastGetRef,

    onError: useEffectEvent((err: unknown): void => {
      onError?.(err);

      const errorStr: string = mapToString(err);
      setAsyncState({
        data: undefined,
        error: errorStr,
        initiated: true,
        loading: false,
      });
    }),

    onGetStart: useEffectEvent((get: () => Promise<T>): void => {
      lastGetRef.current = get;
      setAsyncState({
        data: undefined,
        error: undefined,
        initiated: true,
        loading: true,
      });
    }),

    onSuccess: useEffectEvent((data: T): void => {
      setAsyncState({
        data,
        error: undefined,
        initiated: true,
        loading: false,
      });
    }),
  });

  return {
    ...asyncState,
    asyncEffectRef,

    request: useCallback(
      async (get: () => Promise<T>): Promise<void> => {
        const promise: Promise<void> = getState(get);
        asyncEffectRef.current = promise;
        await promise;
      },
      [getState],
    ),

    reset: useCallback((): void => {
      asyncEffectRef.current = undefined;
      lastGetRef.current = undefined;
      setAsyncState(DEFAULT_ASYNC_STATE);
    }, []),

    retry: useCallback(async (): Promise<void> => {
      if (typeof lastGetRef.current === 'undefined') {
        return;
      }

      const promise: Promise<void> = getState(lastGetRef.current);
      asyncEffectRef.current = promise;
      await promise;
    }, [getState]),

    set: useEffectEvent((data: T): void => {
      asyncEffectRef.current = undefined;
      lastGetRef.current = undefined;
      setAsyncState({
        data,
        error: undefined,
        initiated: true,
        loading: false,
      });
    }),
  };
}
