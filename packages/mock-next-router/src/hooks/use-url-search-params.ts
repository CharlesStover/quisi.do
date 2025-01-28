import type { MemoryHistory, Update } from 'history';
import { useEffect, useMemo, useRef, type RefObject } from 'react';
import useForceUpdate from 'use-force-update';

export default function useUrlSearchParams(
  memoryHistory: MemoryHistory,
): URLSearchParams {
  // States
  const forceUpdate: VoidFunction = useForceUpdate();
  const searchRef: RefObject<string> = useRef(memoryHistory.location.search);

  // Effects
  useEffect((): VoidFunction => {
    const handleUpdate = ({ location }: Update): void => {
      const { search: newSearch } = location;
      if (searchRef.current === newSearch) {
        return;
      }

      searchRef.current = newSearch;
      forceUpdate();
    };

    const unlisten: VoidFunction = memoryHistory.listen(handleUpdate);
    return (): void => {
      unlisten();
    };
  }, [forceUpdate, memoryHistory]);

  const { search } = memoryHistory.location;
  return useMemo((): URLSearchParams => new URLSearchParams(search), [search]);
}
