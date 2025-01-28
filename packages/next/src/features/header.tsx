'use client';

import I18n from 'lazy-i18n';
import { memo, type ReactElement } from 'react';
import useTheme from '../hooks/use-theme.js';
import validateString from '../utils/validate-string.js';
import Authentication from './header-authentication.js';
import Heading from './header-heading.js';
import styles from './header.module.scss';

interface State {
  readonly backgroundColor: string;
}

const CLASS_NAME: string = validateString(styles['header']);
const TAG_LINE_CLASS_NAME: string = validateString(styles['tag-line']);

function useHeader(): State {
  // Contexts
  const { backgroundHex } = useTheme();

  return {
    backgroundColor: backgroundHex,
  };
}

function Header(): ReactElement {
  const { backgroundColor } = useHeader();
  const { displayFontFamily } = useTheme();

  return (
    <header className={CLASS_NAME} style={{ backgroundColor }}>
      <div>
        <Heading />
        <span
          className={TAG_LINE_CLASS_NAME}
          style={{ fontFamily: `"Cairo Play", ${displayFontFamily}` }}
        >
          <I18n>front end platform service</I18n>
        </span>
      </div>
      <Authentication />
    </header>
  );
}

export default memo(Header);
