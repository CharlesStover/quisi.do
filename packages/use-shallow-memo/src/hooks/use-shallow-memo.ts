'use client';

import { useMemo } from 'react';
import mapValueToDependencies from '../utils/map-value-to-dependencies.js';

export default function useShallowMemo<
  T extends boolean | null | number | object | string | undefined,
>(obj: T): T {
  return useMemo((): T => obj, mapValueToDependencies(obj));
}
