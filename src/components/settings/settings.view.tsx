import SpaceBetween from '@awsui/components-react/space-between';
import type { ReactElement } from 'react';
import DarkModeToggle from '../../components/dark-mode-toggle';
// import DesignSystemSelect from '../../components/design-system-select';
import LanguageSelect from '../../components/language-select';

export default function Settings(): ReactElement {
  return (
    <SpaceBetween direction="vertical" size="m">
      <DarkModeToggle />
      {/* <DesignSystemSelect /> */}
      <LanguageSelect />
    </SpaceBetween>
  );
}
