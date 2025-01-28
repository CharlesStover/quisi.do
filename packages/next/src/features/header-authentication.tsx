'use client';

import { useEffect, useState, type ReactElement } from 'react';
import { useAuthentication } from '../contexts/authentication.js';
import LoadingIcon from '../modules/quisi/loading-icon.js';
import AuthenticateLink from './header-authenticate-link.js';
import HeaderAuthenticationUserId from './header-authentication-user-id.js';

interface State {
  readonly id: number | null;
  readonly show: boolean;
  readonly showLoading: boolean;
}

const SHOW_LOADING_TIMEOUT = 200;

function useAuthenticationState(): State {
  const { initiated, data, error, loading } = useAuthentication();
  const [showLoading, setShowLoading] = useState(false);

  useEffect((): VoidFunction | undefined => {
    if (!loading) {
      return;
    }

    const timeout: number = window.setTimeout((): void => {
      setShowLoading(true);
    }, SHOW_LOADING_TIMEOUT);

    return (): void => {
      window.clearTimeout(timeout);
    };
  }, [loading]);

  const getShow = (): boolean => {
    if (!initiated) {
      return false;
    }

    if (loading && !showLoading) {
      return false;
    }

    if (typeof error !== 'undefined') {
      return false;
    }

    return true;
  };

  return {
    id: data?.id ?? null,
    show: getShow(),
    showLoading: loading && showLoading,
  };
}

export default function Authentication(): ReactElement | null {
  const { id, show, showLoading } = useAuthenticationState();

  if (!show) {
    return null;
  }

  if (showLoading) {
    return <LoadingIcon />;
  }

  if (id === null) {
    return <AuthenticateLink />;
  }

  return <HeaderAuthenticationUserId>{id}</HeaderAuthenticationUserId>;
}
