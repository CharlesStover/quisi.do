const LARGE = 32;
const MEDIUM = 16;
const MEDIUM_HEADING = 24;
const SMALL = 12;

export default function mapSizeToMuiFontSize(
  size: 'large' | 'medium-heading' | 'medium' | 'small',
): number {
  switch (size) {
    case 'large':
      return LARGE;
    case 'medium':
      return MEDIUM;
    case 'medium-heading':
      return MEDIUM_HEADING;
    case 'small':
      return SMALL;
  }
}
