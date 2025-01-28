'use client';

import * as fullStoryBrowser from '@fullstory/browser';
import type { ApiV1, ApiV2, FSApi } from '@fullstory/snippet';
import { useMemo, type PropsWithChildren, type ReactElement } from 'react';
import useShallowMemo from 'use-shallow-memo';
import FullstoryBrowser from '../contexts/fullstory-browser.js';
import mapV2OperationHandlersToApi, {
  type V2AsyncOperationHandlers,
  type V2OperationHandlers,
} from '../utils/map-v2-operation-handlers-to-api.js';
import merge from '../utils/merge.js';
import noop from '../utils/noop.js';
import Fullstory from './fullstory.js';

type Props = Partial<
  FSApi &
    typeof fullStoryBrowser &
    V2AsyncOperationHandlers &
    V2OperationHandlers
>;

export default function MockFullstory({
  children,
  orgId,
  ...props
}: PropsWithChildren<Props & { orgId: string }>): ReactElement {
  const memoizedProps: Props = useShallowMemo(props);

  const value: typeof fullStoryBrowser =
    useMemo((): typeof fullStoryBrowser => {
      /**
       * `ApiV2` has a default interface:
       *   <Op>(operation: Op, options: Options[Op]) => ReturnType[Op]
       */
      const apiV2Default: Omit<ApiV2, keyof ApiV2> =
        mapV2OperationHandlersToApi(memoizedProps);

      const apiV1: ApiV1 = {
        ...fullStoryBrowser.FullStory,
        ...memoizedProps,
      };

      return {
        ...fullStoryBrowser,
        init: noop,
        ...memoizedProps,
        FullStory: merge(apiV2Default, apiV1),
      };
    }, [memoizedProps]);

  return (
    <FullstoryBrowser.Provider value={value}>
      <Fullstory orgId={orgId}>{children}</Fullstory>
    </FullstoryBrowser.Provider>
  );
}
