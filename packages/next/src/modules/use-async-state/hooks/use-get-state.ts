import { type RefObject } from 'react';
import useEffectEvent from '../../../hooks/use-effect-event.js';

interface Options<T> {
  readonly lastGetRef: RefObject<(() => Promise<T>) | undefined>;
  readonly onError: (error: unknown) => void;
  readonly onGetStart: (get: () => Promise<T>) => void;
  readonly onSuccess: (data: T) => void;
}

export default function useGetState<T = unknown>({
  lastGetRef,
  onError,
  onGetStart,
  onSuccess,
}: Options<T>): (get: () => Promise<T>) => Promise<void> {
  return useEffectEvent(async (get: () => Promise<T>): Promise<void> => {
    onGetStart(get);

    try {
      const data: T = await get();

      // If this data does not belong to this getter, bail.
      if (get !== lastGetRef.current) {
        return;
      }

      onSuccess(data);
    } catch (err: unknown) {
      // If this error does not belong to this getter, bail.
      if (get !== lastGetRef.current) {
        return;
      }

      onError(err);
    }
  });
}
