import { type Viewport } from 'next';
import { type ThemeColorDescriptor } from 'next/dist/lib/metadata/types/metadata-types';

const THEME_COLOR_DESCRIPTORS: readonly ThemeColorDescriptor[] = [
  {
    color: '#13171a',
    media: '(prefers-color-scheme: dark)',
  },
  {
    color: '#f8f4f0',
    media: '(prefers-color-scheme: light)',
  },
];

/**
 * TODO: Validate these against the standard documented on MDN:
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
 */
export default {
  colorScheme: 'dark light',
  initialScale: 1,
  themeColor: [...THEME_COLOR_DESCRIPTORS],
  width: 'device-width',
} satisfies Viewport;
