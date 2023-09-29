import type { Context } from 'react';
import { createContext } from 'react';
import type TranslateFunctionType from '../types/translate-function.js';
import defaultTranslateFunction from '../utils/default-translate-function.js';

const TranslateFunction: Context<TranslateFunctionType> =
  createContext<TranslateFunctionType>(defaultTranslateFunction);
export default TranslateFunction;
