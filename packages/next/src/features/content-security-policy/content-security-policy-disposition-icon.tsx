import type { ReactElement } from 'react';
import Emoji from '../../components/emoji.jsx';

interface Props {
  readonly children: string;
}

const mapDispositionToEmoji = (disposition: string): string => {
  switch (disposition) {
    case 'enforce':
      return '❌';
    case 'report':
      return '⚠️';
    default:
      return '❔';
  }
};

export default function ContentSecurityPolicyDispositionIcon({
  children,
}: Props): ReactElement {
  const emoji: string = mapDispositionToEmoji(children);

  return <Emoji>{emoji}</Emoji>;
}
