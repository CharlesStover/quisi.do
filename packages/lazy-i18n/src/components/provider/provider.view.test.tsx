import { render } from '@testing-library/react';
import assert from 'node:assert';
import {
  type ComponentType,
  type PropsWithChildren,
  type ReactElement,
  useContext,
  useEffect,
} from 'react';
import { describe, expect, it, vi } from 'vitest';
import Loading from '../../components/loading/index.js';
import LoadingComponentContext from '../../contexts/loading-component.js';
import TranslateFunctionContext from '../../contexts/translate-function.js';
import { I18nProvider } from '../../index.js';
import type TranslateFunctionType from '../../types/translate-function.js';
import type { Translations } from '../../types/translations.js';

const TEST_TRANSLATIONS: Record<string, Translations> = {
  es_ES: {
    cat: 'gato',
  },
};

describe('Provider', (): void => {
  it('should set the contexts to their default values', (): void => {
    let LoadingComponent: ComponentType<unknown> | null = null;
    let translate: TranslateFunctionType | undefined;

    function TestComponent(): null {
      const loadingComponent = useContext(LoadingComponentContext);
      const translateFunction = useContext(TranslateFunctionContext);

      useEffect((): void => {
        LoadingComponent = loadingComponent;
        translate = translateFunction;
      }, [loadingComponent, translateFunction]);

      return null;
    }

    render(<TestComponent />, {
      wrapper({ children }: PropsWithChildren): ReactElement {
        return (
          <I18nProvider locale="es_ES" translations={TEST_TRANSLATIONS}>
            {children}
          </I18nProvider>
        );
      },
    });

    assert(typeof translate !== 'undefined');
    expect(LoadingComponent).toBe(Loading);
    expect(translate('cat')).toBe('gato');
  });

  it('should set the contexts to the user-specified props', (): void => {
    let LoadingComponent: ComponentType<unknown> | null = null;

    function TestComponent(): null {
      const loadingComponent = useContext(LoadingComponentContext);

      useEffect((): void => {
        LoadingComponent = loadingComponent;
      }, [loadingComponent]);

      return null;
    }

    const TestLoadingComponent = vi.fn();

    render(<TestComponent />, {
      wrapper({ children }: PropsWithChildren): ReactElement {
        return (
          <I18nProvider
            LoadingComponent={TestLoadingComponent}
            locale="es_ES"
            translations={TEST_TRANSLATIONS}
          >
            {children}
          </I18nProvider>
        );
      },
    });

    expect(LoadingComponent).toBe(TestLoadingComponent);
  });
});
