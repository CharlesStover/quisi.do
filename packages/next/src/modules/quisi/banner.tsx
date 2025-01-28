'use client';

import { useButton } from '@react-aria/button';
import { useRef, type ReactElement, type ReactNode } from 'react';
import Emoji from '../../components/emoji.js';
import useTheme from '../../hooks/use-theme.js';
import optional from '../../utils/optional.js';
import validateString from '../../utils/validate-string.js';
import styles from './banner.module.scss';

export interface Props {
  readonly children: ReactNode;
  readonly icon?: string | undefined;
  readonly onDismiss?: VoidFunction | undefined;
  readonly type: 'error' | 'info' | 'success' | 'warning';
}

const BUTTON_CLASS_NAME: string = validateString(styles['button']);
const CLASS_NAME: string = validateString(styles['banner']);

export default function Banner({
  children,
  icon,
  onDismiss,
}: Props): ReactElement {
  // Contexts
  const { secondaryHex } = useTheme();

  // States
  const { buttonProps } = useButton(
    {
      ...optional('onPress', onDismiss),
    },
    useRef<HTMLButtonElement>(null as unknown as HTMLButtonElement),
  );

  return (
    <aside
      className={CLASS_NAME}
      style={{
        backgroundColor: secondaryHex,
        borderColor: secondaryHex,
      }}
    >
      {typeof icon === 'string' && (
        <>
          <Emoji>{icon}</Emoji>{' '}
        </>
      )}
      <div
        style={{
          flexGrow: 1,
        }}
      >
        {children}
      </div>
      <button className={BUTTON_CLASS_NAME} {...buttonProps}>
        <Emoji>❌</Emoji>
      </button>
    </aside>
  );
}
