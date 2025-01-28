import { FullStory } from '@fullstory/browser';
import { render } from '@testing-library/react';
import { MockAwsRumProvider } from 'aws-rum-react';
import { MockFullstory } from 'fullstory-react';
import { type PropsWithChildren, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import THEME from '../../constants/theme.js';
import { HostnameProvider } from '../../contexts/hostname.js';
import Theme from '../../contexts/theme.js';
import Button from './button.js';

const MOCK_FULLSTORY = Object.assign(vi.fn(), FullStory);

describe('Button', (): void => {
  it('should have a matching background and outline color', (): void => {
    const { baseElement } = render(
      <Button feature="test">test children</Button>,
      {
        wrapper({ children }: PropsWithChildren): ReactElement {
          return (
            <HostnameProvider value="localhost">
              <MockAwsRumProvider>
                <MockFullstory FullStory={MOCK_FULLSTORY} orgId="test-org-id">
                  <Theme.Provider value={THEME}>{children}</Theme.Provider>
                </MockFullstory>
              </MockAwsRumProvider>
            </HostnameProvider>
          );
        },
      },
    );

    const backgroundColor: string =
      baseElement.style.getPropertyValue('background-color');
    const outlineColor: string =
      baseElement.style.getPropertyValue('outline-color');
    expect(backgroundColor).toBe(outlineColor);
  });
});
