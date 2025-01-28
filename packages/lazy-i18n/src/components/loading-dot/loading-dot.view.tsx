import type { CSSProperties, ReactElement } from 'react';
import styles from './loading-dot.module.scss';

interface Props {
  readonly index: 0 | 1 | 2;
}

const STYLES: [CSSProperties, CSSProperties, CSSProperties] = [
  {
    animationDelay: '0',
  },
  {
    animationDelay: '0.125s',
  },
  {
    animationDelay: '0.25s',
  },
];

export default function I18nLoadingDot({ index }: Props): ReactElement {
  return (
    <span className={styles['root']} style={STYLES[index]}>
      .
    </span>
  );
}
