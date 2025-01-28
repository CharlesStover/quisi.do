import { render } from '@testing-library/react';
import { type PropsWithChildren, type ReactElement, act } from 'react';
import { describe, it, vi } from 'vitest';
import I18n, { I18nProvider } from '../index.js';

function TestLoadingComponent(): ReactElement {
  return <>test loading component</>;
}

describe('I18n', (): void => {
  it('should render the loading component then the translation', async (): Promise<void> => {
    const ES_ES_PROMISE = Promise.resolve({
      Spanish: 'Espanol',
    });
    const MOCK_ES_ES = vi.fn().mockReturnValue(ES_ES_PROMISE);
    const { getByText } = render(<I18n>Spanish</I18n>, {
      wrapper({ children }: PropsWithChildren): ReactElement {
        return (
          <I18nProvider
            LoadingComponent={TestLoadingComponent}
            locale="es_ES"
            translations={{
              es_ES: MOCK_ES_ES,
            }}
          >
            {children}
          </I18nProvider>
        );
      },
    });
    getByText('test loading component');

    await act(async (): Promise<void> => {
      await ES_ES_PROMISE;
    });

    getByText('Espanol');
  });
});
