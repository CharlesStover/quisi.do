import type { Metadata } from 'next';
import mapPathToAlternates from '../utils/map-path-to-alternates';
import AUTHOR_QUISIDO from './author-quisido';
import FORMAT_DETECTION from './format-detection';
import KEYWORDS from './keywords';
// import ROBOTS_INFO from './robots-info';
import THEME_COLOR_DESCRIPTORS from './theme-color-descriptors';
import VIEWPORT from './viewport';

/**
 * TODO: Validate these against the standard documented on MDN:
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
 */
export default {
  alternates: mapPathToAlternates('/'),
  applicationName: 'Quisi.do',
  authors: [AUTHOR_QUISIDO],
  colorScheme: 'dark light',
  creator: 'Quisido',
  description: 'portfolio for Quisido',
  formatDetection: FORMAT_DETECTION,
  generator: null,
  keywords: [...KEYWORDS],
  manifest: '/manifest.json',
  metadataBase: new URL('/', 'https://quisi.do'),
  publisher: 'Quisido',
  referrer: 'no-referrer-when-downgrade',
  // robots: ROBOTS_INFO,
  themeColor: [...THEME_COLOR_DESCRIPTORS],
  title: 'Quisido',
  viewport: VIEWPORT,

  appLinks: {
    web: {
      url: 'https://quisi.do/',
    },
  },

  openGraph: {
    // audio: OGAudio | Array<OGAudio>
    // countryName: string
    description: 'portfolio of Quisido',
    // determiner: 'a' | 'an' | 'the' | 'auto' | ''
    emails: ['open-graph@quisi.do'],
    firstName: 'Chaz',
    gender: 'male',
    // images: OGImage | Array<OGImage>
    lastName: 'Quisido',
    locale: 'en-US',
    siteName: 'Quisi.do',
    title: 'Quisido',
    type: 'profile',
    url: 'https://quisi.do/',
    // videos: OGVideo | Array<OGVideo>
  },

  twitter: {
    creatorId: 'CharlesStover',
    description: 'portfolio of Quisido',
    // images: TwitterImage | Array<TwitterImage>;
    siteId: 'CharlesStover',
    title: 'Quisido', // <-- title of the page, not the website
  },
} satisfies Metadata;