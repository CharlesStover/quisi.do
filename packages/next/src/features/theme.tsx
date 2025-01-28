'use client';

import { memo, type PropsWithChildren, type ReactElement } from 'react';
import THEME from '../constants/theme.js';
import ThemeContext from '../contexts/theme.js';

// Import darkVisualStudio from '../themes/dark-visual-studio.json';
// Import flattenVSCodeColorTheme from '../utils/flatten-vscode-color-theme.js';
// Const flatDarkVisualStudio = flattenVSCodeColorTheme(darkVisualStudio);
// Const mapVSCodeColorThemeToTheme = theme => ({
//   BackgroundColor: flatDarkVisualStudio['editor.background'],
//   DisplayFontWeight: 700,
//   ForegroundColor: flatDarkVisualStudio['editor.foreground'],
//   Primary: [200, 240, 160],
//   PrimaryFontWeight: 700,
//   DisplayFontFamily: '"Noto Sans Display", "Noto Sans", Helvetica, sans-serif',
// });

function Theme({ children }: PropsWithChildren): ReactElement {
  return (
    <ThemeContext.Provider value={THEME}>{children}</ThemeContext.Provider>
  );
}

export default memo(Theme);
