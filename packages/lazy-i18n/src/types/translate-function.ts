import type { ReactNode } from 'react';
import type { ReactNodeTranslationValue } from '../types/react-node-translation-value.js';
import type { StringTranslationValue } from '../types/string-translation-value.js';

type ReactNodeVars = Record<string, ReactNodeTranslationValue>;
type StringVars = Record<string, StringTranslationValue>;

export interface TranslateFunction {
  // translate('Hello, world!')
  (str: string): string | undefined;

  // translate('Hello, $world!', { world: 'there' })
  (str: string, vars: StringVars): string | undefined;

  // translate('Hello, $world!', { world: <strong>there</strong> })
  (str: string, vars: ReactNodeVars): ReactNode | undefined;
}
