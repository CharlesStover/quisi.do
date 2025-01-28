'use client';

import {
  useLayoutEffect,
  useMemo,
  type PropsWithChildren,
  type ReactElement,
} from 'react';
import useTheme from '../../hooks/use-theme.js';
import map from '../../utils/map.js';
import validateString from '../../utils/validate-string.js';
import styles from './theme.module.scss';

const BORDER_COLOR_OPACITY = 0.15;
const CLASS_NAME: string = validateString(styles['theme']);
const INNER_BORDER_COLOR_CLASS_NAME: string = validateString(
  styles['border-inner'],
);
const MAX_COLOR = 255;
const OUTER_BORDER_COLOR_CLASS_NAME: string = validateString(
  styles['border-outer'],
);

const invert = (color: number): number => MAX_COLOR - color;

function useBackgroundImage(): string {
  const { background } = useTheme();

  return useMemo((): string => {
    const invertedRgb: readonly [number, number, number] = map(
      background,
      invert,
    );

    const gradient: string = [
      'transparent',
      `rgba(${invertedRgb.join(', ')}, 0.05) 1px`,
      'transparent 1px',
      'transparent 1rem',
    ].join(', ');

    return `repeating-linear-gradient(${gradient})`;
  }, [background]);
}

export default function Theme({ children }: PropsWithChildren): ReactElement {
  const { backgroundHex, foregroundHex, secondaryAlpha } = useTheme();
  const backgroundImage: string = useBackgroundImage();
  const borderColor: string = secondaryAlpha(BORDER_COLOR_OPACITY);

  useLayoutEffect((): VoidFunction => {
    const { style } = window.document.body;

    const previousColor: string | null = style.getPropertyValue('color');
    const previousBackgroundColor: string | null =
      style.getPropertyValue('background-color');

    style.setProperty('background-color', backgroundHex);
    style.setProperty('color', foregroundHex);
    return (): void => {
      style.setProperty('background-color', previousBackgroundColor);
      style.setProperty('color', previousColor);
    };
  }, [backgroundHex, foregroundHex]);

  return (
    <div
      className={OUTER_BORDER_COLOR_CLASS_NAME}
      style={{
        borderColor,
      }}
    >
      <div
        className={INNER_BORDER_COLOR_CLASS_NAME}
        style={{
          borderColor: backgroundHex,
        }}
      >
        <div
          className={CLASS_NAME}
          style={{
            backgroundImage,
            borderColor,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
