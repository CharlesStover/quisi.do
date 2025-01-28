import { useEffect, useRef, type RefObject } from 'react';

export default function useMountedRef(): RefObject<boolean> {
  const isMountedRef: RefObject<boolean> = useRef(true);

  useEffect(
    (): VoidFunction => (): void => {
      isMountedRef.current = false;
    },
    [],
  );

  return isMountedRef;
}
