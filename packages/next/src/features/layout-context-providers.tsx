import { Fragment, type ComponentType, type PropsWithChildren } from 'react';
import Authentication from '../features/authentication.js';
import CloudWatchRUM from '../features/cloudwatch-rum.js';
import Fullstory from '../features/fullstory.js';
import HostnameProvider from '../features/hostname-provider.js';
import NotificationsProvider from '../features/notifications-provider.js';
import Sentry from '../features/sentry.jsx';
import SessionIdProvider from '../features/session-id-provider.js';
import ThemeFeature from '../features/theme.js';
import TracerProviderProvider from '../features/tracer-provider-provider.js';
import withWrappers from '../hocs/with-wrappers/index.js';
import Theme from '../modules/quisi/theme.jsx';

const LayoutContextProviders: ComponentType<PropsWithChildren> = withWrappers(
  Authentication,
  CloudWatchRUM,
  Fullstory,
  HostnameProvider,
  NotificationsProvider,
  Sentry,
  SessionIdProvider,
  ThemeFeature,
  Theme,
  TracerProviderProvider,
  // Turnstile,

  // Requires `HostnameProvider`.
  // Honeycomb, // Error: "Critical dependency: the request of a dependency is an expression"
)(Fragment);

export default LayoutContextProviders;
