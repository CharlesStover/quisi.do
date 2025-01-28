import type { ReactElement, ReactNode } from 'react';
import validateString from '../../utils/validate-string.js';
import styles from './header.module.scss';
import type { HeadingLevel } from './heading-level.js';

export interface Props {
  readonly actions?: ReactNode | undefined;
  readonly children: ReactNode;
  readonly level?: HeadingLevel | undefined;
}

const DEFAULT_LEVEL = 2;
const HEADING_CLASS_NAME: string = validateString(styles['heading']);

export default function Header({
  actions,
  children,
  level = DEFAULT_LEVEL,
}: Props): ReactElement {
  const Heading: `h${typeof level}` = `h${level}`;
  return (
    <header>
      <Heading className={HEADING_CLASS_NAME}>{children}</Heading>
      {typeof actions !== 'undefined' && <div>{actions}</div>}
    </header>
  );
}
