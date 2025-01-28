'use client';

import { type AsyncState } from '../modules/use-async-state/index.js';
import type Authentication from '../types/authentication.js';
import createContextUtils from '../utils/create-context-utils/index.js';

export type AuthenticationState = AsyncState<Authentication>;

export const {
  ContextProvider: AuthenticationProvider,
  useContextValue: useAuthentication,
} = createContextUtils<AuthenticationState>();
