import { type Metadata } from 'next';

// eslint-disable-next-line @typescript-eslint/no-type-alias
type RobotsInfo = Metadata['robots'] extends infer T | string | null | undefined
  ? T
  : never;

const ROBOTS_INFO: Omit<
  Required<RobotsInfo>,
  | 'googleBot'
  | 'max-video-preview'
  | 'nofollow'
  | 'noindex'
  | 'unavailable_after'
> = {
  follow: true,
  index: true,
  indexifembedded: true,
  'max-image-preview': 'large',
  'max-snippet': -1,
  noarchive: false,
  nocache: false,
  noimageindex: false,
  nosnippet: false,
  notranslate: false,
  nositelinkssearchbox: false,
};

export default ROBOTS_INFO;
