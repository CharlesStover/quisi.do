'use client';

import { useMemo, type ReactElement } from 'react';
import LogRocket, { type User } from '../components/log-rocket.js';
import {
  useAuthentication,
  type AuthenticationState,
} from '../contexts/authentication.js';
import sanitizeLogRocketRequest from '../utils/sanitize-log-rocket-request.js';
import sanitizeLogRocketResponse from '../utils/sanitize-log-rocket-response.js';

function useLogRocketUser(): User | undefined {
  // Contexts
  const { data }: AuthenticationState = useAuthentication();

  return useMemo((): User | undefined => {
    if (typeof data === 'undefined') {
      return;
    }

    if (data.id === null) {
      return;
    }

    return {
      id: data.id.toString(),
    };
  }, [data]);
}

export default function LogRocketFeature(): ReactElement {
  const user: User | undefined = useLogRocketUser();

  return (
    <LogRocket
      appId="zkwhgg/quisido"
      sanitizeRequest={sanitizeLogRocketRequest}
      sanitizeResponse={sanitizeLogRocketResponse}
      user={user}
    />
  );
}
