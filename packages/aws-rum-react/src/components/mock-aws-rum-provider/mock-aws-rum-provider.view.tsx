'use client';

import { AwsRum } from 'aws-rum-web';
import { type ReactElement, type ReactNode, useMemo } from 'react';
import useShallowMemo from 'use-shallow-memo';
import AwsRumContext from '../../contexts/aws-rum.js';
import noop from '../../utils/noop.js';
import stripUndefinedValues from '../../utils/strip-undefined-values.js';

interface Props {
  readonly addPlugin?: AwsRum['addPlugin'] | undefined;
  readonly addSessionAttributes?: AwsRum['addSessionAttributes'] | undefined;
  readonly allowCookies?: AwsRum['allowCookies'] | undefined;
  readonly children: ReactNode;
  readonly disable?: AwsRum['disable'] | undefined;
  readonly dispatch?: AwsRum['dispatch'] | undefined;
  readonly dispatchBeacon?: AwsRum['dispatchBeacon'] | undefined;
  readonly enable?: AwsRum['enable'] | undefined;
  readonly recordError?: AwsRum['recordError'] | undefined;
  readonly recordEvent?: AwsRum['recordEvent'] | undefined;
  readonly recordPageView?: AwsRum['recordPageView'] | undefined;
  readonly registerDomEvents?: AwsRum['registerDomEvents'] | undefined;
  readonly setAwsCredentials?: AwsRum['setAwsCredentials'] | undefined;
}

export default function MockAwsRumProvider({
  children,
  ...props
}: Props): ReactElement {
  const memoizedProps: Omit<Props, 'children'> = useShallowMemo(props);
  const client: AwsRum = useMemo((): AwsRum => {
    const newClient: Pick<AwsRum, keyof AwsRum> = {
      addPlugin: noop,
      addSessionAttributes: noop,
      allowCookies: noop,
      disable: noop,
      dispatch: noop,
      dispatchBeacon: noop,
      enable: noop,
      recordError: noop,
      recordEvent: noop,
      recordPageView: noop,
      registerDomEvents: noop,
      setAwsCredentials: noop,
      ...stripUndefinedValues(memoizedProps),
    };

    // `newClient instanceof AwsRum`
    Object.setPrototypeOf(newClient, AwsRum.prototype);

    return newClient as AwsRum;
  }, [memoizedProps]);

  return (
    <AwsRumContext.Provider value={client}>{children}</AwsRumContext.Provider>
  );
}
