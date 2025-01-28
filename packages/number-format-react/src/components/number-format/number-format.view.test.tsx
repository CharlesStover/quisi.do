import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import NumberFormat from '../../index.js';

describe('NumberFormat', (): void => {
  it('should render numeric strings', (): void => {
    const { getByText } = render(
      <>
        The number is <NumberFormat>21</NumberFormat>.
      </>,
    );

    getByText('The number is 21.');
  });

  it('should render numbers', (): void => {
    const { getByText } = render(
      <>
        The number is <NumberFormat>{24}</NumberFormat>.
      </>,
    );

    getByText('The number is 24.');
  });
});
