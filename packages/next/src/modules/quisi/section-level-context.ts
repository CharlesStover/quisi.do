import { createContext } from 'react';
import { type HeadingLevel } from './heading-level.js';

const DEFAULT_HEADING_LEVEL = 2;

export default createContext<HeadingLevel>(DEFAULT_HEADING_LEVEL);
