import type { Location, MemoryHistory, Update } from 'history';
import { useEffect, useRef, type RefObject } from 'react';

const ORIGIN = 'https://localhost';

export default function useHashChangeEvents(
  memoryHistory: MemoryHistory,
): void {
  const locationRef: RefObject<Location> = useRef(memoryHistory.location);

  // Effects
  useEffect((): VoidFunction => {
    const handleUpdate = ({ location }: Update): void => {
      const {
        hash: newHash,
        pathname: newPathname,
        search: newSearch,
      } = location;

      const {
        hash: oldHash,
        pathname: oldPathname,
        search: oldSearch,
      } = locationRef.current;

      locationRef.current = location;
      if (newHash === oldHash) {
        return;
      }

      const hashChangeEvent: HashChangeEvent = new HashChangeEvent(
        'hashchange',
        {
          newURL: `${ORIGIN}${newPathname}${newSearch}${newHash}`,
          oldURL: `${ORIGIN}${oldPathname}${oldSearch}${oldHash}`,
        },
      );

      window.dispatchEvent(hashChangeEvent);
    };

    const unlisten: VoidFunction = memoryHistory.listen(handleUpdate);
    return (): void => {
      unlisten();
    };
  }, [memoryHistory]);
}
