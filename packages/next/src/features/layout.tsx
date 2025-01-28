import { StrictMode, type PropsWithChildren, type ReactElement } from 'react';
import Footer from '../features/footer.js';
import Header from '../features/header.js';
import styles from '../features/layout.module.scss';
import LogRocket from '../features/log-rocket.js';
import Mixpanel from '../features/mixpanel.js';
import Notifications from '../features/notifications.js';
import validateString from '../utils/validate-string.js';
import Analytics from './analytics.jsx';
import Head from './head.jsx';
import LayoutContextProviders from './layout-context-providers.jsx';

const BODY_CLASS_NAME: string = validateString(styles['body']);
const HTML_CLASS_NAME: string = validateString(styles['html']);

function RootLayout({ children }: Readonly<PropsWithChildren>): ReactElement {
  return (
    <StrictMode>
      <html className={HTML_CLASS_NAME} lang="en">
        <Head />
        <body className={BODY_CLASS_NAME}>
          <noscript>
            <p>JavaScript is required. Sorry for the inconvenience.</p>
          </noscript>
          {/**
           *   We do not put wrappers around `<body>` itself, because we do not
           * want to inadvertently render HTML elements around `<body>`.
           */}
          <LayoutContextProviders>
            <Notifications />
            <Header />
            <main>{children}</main>
            <Footer />
            <LogRocket />
          </LayoutContextProviders>
          <Analytics />
          <Mixpanel />
        </body>
      </html>
    </StrictMode>
  );
}
export default RootLayout;
