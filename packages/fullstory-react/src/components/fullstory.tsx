'use client';

import type { SnippetOptions } from '@fullstory/browser';
import { useEffect, type PropsWithChildren, type ReactElement } from 'react';
import useShallowMemo from 'use-shallow-memo';
import FullstoryContext from '../contexts/fullstory.js';
import useFullStoryBrowser from '../hooks/use-fullstory-browser.js';

export default function Fullstory({
  children,
  ...snippetOptions
}: PropsWithChildren<SnippetOptions>): ReactElement {
  // Contexts
  const {
    FullStory: fullStoryApi,
    init,
    isInitialized,
  } = useFullStoryBrowser();

  // States
  const memoizedSnippetOptions: SnippetOptions = useShallowMemo(snippetOptions);

  // Effects
  useEffect((): VoidFunction | undefined => {
    if (isInitialized()) {
      return;
    }

    init(memoizedSnippetOptions);
    return (): void => {
      fullStoryApi('shutdown');
    };
  }, [fullStoryApi, init, isInitialized, memoizedSnippetOptions]);

  return (
    <FullstoryContext.Provider value={fullStoryApi}>
      {children}
    </FullstoryContext.Provider>
  );
}
