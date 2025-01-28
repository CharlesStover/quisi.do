import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import inner from '../test/utils/inner.js';
import replaceVariables from './replace-variables.js';

function TestHello(): ReactElement {
  return <strong>olleh</strong>;
}

function TestWorld(): ReactElement {
  return <em>dlrow</em>;
}

describe('replaceVariables', (): void => {
  it('should return strings with no variables', (): void => {
    expect(replaceVariables('test')).toBe('test');
  });

  it('should replace string variables', (): void => {
    expect(
      replaceVariables('my $one $two $three string', {
        one: 1,
        three: 3,
        two: 'two',
      }),
    ).toBe('my 1 two 3 string');
  });

  it('should replace React node variables', (): void => {
    const { getByText } = render(
      <>
        {replaceVariables('$hello, $world? $num! $world $hello.', {
          hello: <TestHello />,
          num: 1234,
          world: <TestWorld />,
        })}
      </>,
    );
    getByText(inner('olleh, dlrow? 1234! dlrow olleh.'));
  });
});
