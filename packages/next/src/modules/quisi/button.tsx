'use client';

import { type ReactElement, type ReactNode } from 'react';
import useElementId from '../../hooks/use-element-id.js';
import useEmit from '../../hooks/use-emit/index.js';
import useTheme from '../../hooks/use-theme.js';
import validateString from '../../utils/validate-string.js';
import styles from './button.module.scss';
import Element from './button/element.jsx';

export interface Props {
  readonly children: ReactNode;
  readonly feature: string;
  readonly href?: string | undefined;
  readonly onClick?: VoidFunction | undefined;
}

const CLASS_NAME: string = validateString(styles['button']);

export default function Button({
  children,
  feature,
  href,
  onClick,
}: Props): ReactElement {
  // Contexts
  const emit = useEmit();
  const { backgroundHex, primaryFontWeight, primaryHex } = useTheme();

  // States
  const id: string = useElementId();

  return (
    <>
      <style type="text/css">{`
#${id}:not(:focus-visible) {
  outline-color: ${backgroundHex};
}
`}</style>
      <Element
        className={CLASS_NAME}
        href={href}
        id={id}
        onPress={(): void => {
          if (typeof onClick === 'function') {
            onClick();
          }

          emit('button.click', {
            feature,
          });
        }}
        style={{
          backgroundColor: backgroundHex,
          borderColor: primaryHex,
          borderImageSource: `repeating-linear-gradient(45deg, ${primaryHex}, ${primaryHex} 1px, ${backgroundHex} 1px, ${backgroundHex} 4px)`,
          fontWeight: primaryFontWeight,
        }}
      >
        {children}
      </Element>
    </>
  );
}
