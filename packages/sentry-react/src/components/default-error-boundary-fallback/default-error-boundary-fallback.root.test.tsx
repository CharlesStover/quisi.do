import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import DefaultErrorBoundaryFallback from './index.js';

describe('DefaultErrorBoundaryFallback', (): void => {
  it('should render the error message', (): void => {
    const { getByText } = render(
      <DefaultErrorBoundaryFallback error={new Error('test message')} />,
    );
    getByText('test message');
  });
});
