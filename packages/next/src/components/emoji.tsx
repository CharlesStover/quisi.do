import { type PropsWithChildren, type ReactElement } from 'react';
import validateString from '../utils/validate-string.js';
import styles from './emoji.module.scss';

interface Props {
  readonly className?: string | undefined;
}

const CLASS_NAME: string = validateString(styles['emoji']);

const getClassName = (className: string | undefined): string => {
  const classNames: string[] = [CLASS_NAME];
  if (typeof className === 'string') {
    classNames.push(className);
  }
  return classNames.join(' ');
};

export default function Emoji({
  children,
  className: classNameProp,
}: PropsWithChildren<Props>): ReactElement {
  const className: string = getClassName(classNameProp);

  return (
    <span aria-hidden className={className} role="img">
      {children}
    </span>
  );
}
