import type { MemoryHistory } from 'history';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime.js';
import { Router } from 'next/router.js';
import {
  Fragment,
  useMemo,
  type PropsWithChildren,
  type ReactElement,
} from 'react';
import createPromise from '../utils/create-promise.js';
import initNextData from '../utils/init-next-data.js';
import mapIterableToRecord from '../utils/map-iterable-to-record.js';
import noop from '../utils/noop.js';
import Null from './null.js';

interface Props {
  readonly history: MemoryHistory;
}

// The `Router` constructor requires `window.__NEXT_DATA__`.
initNextData();

export default function MockRouter({
  children,
  history,
}: PropsWithChildren<Props>): ReactElement {
  const value: Router = useMemo((): Router => {
    const { pathname, search } = history.location;
    const urlSearchParams: URLSearchParams = new URLSearchParams(search);
    const query: Record<string, string | string[] | undefined> =
      mapIterableToRecord(urlSearchParams.entries());
    return new Router(pathname, query, '', {
      App: Null,
      Component: Fragment,
      initialProps: {},
      isFallback: false,
      subscription: createPromise,
      wrapApp: noop,

      pageLoader: {
        getMiddleware: noop,
      },
    });
  }, [history]);

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}
