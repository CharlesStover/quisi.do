import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import Head from './head.jsx';

const NONE = 0;

describe('Head', (): void => {
  beforeEach((): void => {
    Object.defineProperty(document, 'body', {
      value: window.document.createElement('body'),
    });
  });

  it('should preconnect', (): void => {
    const { container } = render(<Head />, {
      container: window.document,
    });

    const preconnects = container.querySelectorAll('link[rel="preconnect"]');
    expect(preconnects.length).toBeGreaterThan(NONE);
  });
});
