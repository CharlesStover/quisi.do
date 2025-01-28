import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime.js';
import type { NextRouter } from 'next/router.js';
import { useContext, type RefObject } from 'react';

interface State {
  readonly Consumer: () => null;
  readonly router: RefObject<NextRouter | null>;
}

export default function createRouterConsumer(): State {
  const router: RefObject<NextRouter | null> = {
    current: null,
  };

  return {
    router,

    Consumer: function RouterConsumer(): null {
      router.current = useContext(RouterContext);
      return null;
    },
  };
}
