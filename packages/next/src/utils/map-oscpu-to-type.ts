import {
  OS_TYPE_VALUE_LINUX,
  OS_TYPE_VALUE_WINDOWS,
} from '@opentelemetry/semantic-conventions/incubating';

export default function mapOscpuToType(
  oscpu: string | undefined,
): string | undefined {
  if (typeof oscpu === 'undefined') {
    return;
  }

  // Windows
  if (oscpu.startsWith('Win')) {
    return OS_TYPE_VALUE_WINDOWS;
  }

  switch (oscpu) {
    case 'Mac_PowerPC':
    case 'Macintosh':
    case 'X11':
      return OS_TYPE_VALUE_LINUX;

    case 'WOW64':
      return OS_TYPE_VALUE_WINDOWS;

    default:
      return oscpu.toLowerCase();
  }
}
