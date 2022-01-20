import { Mode, applyMode } from '@awsui/global-styles';
import { useLayoutEffect } from 'react';
import useDarkMode from '../../hooks/use-dark-mode';
import useGlobalStyles from './hooks/use-aws-global-styles';

export default function useAwsTheme(): void {
  const [isDarkModeEnabled] = useDarkMode();

  useGlobalStyles();

  useLayoutEffect((): VoidFunction | undefined => {
    if (isDarkModeEnabled) {
      applyMode(Mode.Dark, document.body);
    } else {
      applyMode(Mode.Light, document.body);
    }

    return (): void => {
      applyMode(null, document.body);
    };
  }, [isDarkModeEnabled]);
}
