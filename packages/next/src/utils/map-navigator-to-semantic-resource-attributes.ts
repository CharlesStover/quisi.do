import {
  ATTR_OS_DESCRIPTION,
  ATTR_OS_NAME,
  ATTR_OS_TYPE,
  ATTR_WEBENGINE_DESCRIPTION,
  ATTR_WEBENGINE_NAME,
  ATTR_WEBENGINE_VERSION,
} from '@opentelemetry/semantic-conventions/incubating';
import mapOscpuToName from './map-oscpu-to-name.js';
import mapOscpuToType from './map-oscpu-to-type.js';
import validateString from './validate-string.js';

export type SemanticResourceNavigatorAttributes = Record<
  typeof ATTR_WEBENGINE_DESCRIPTION,
  string
> &
  Partial<
    Record<
      | typeof ATTR_OS_DESCRIPTION
      | typeof ATTR_OS_NAME
      | typeof ATTR_OS_TYPE
      | typeof ATTR_WEBENGINE_NAME
      | typeof ATTR_WEBENGINE_VERSION,
      string | undefined
    >
  >;

export default function mapNavigatorToSemanticResourceAttributes(
  navigator: Navigator,
): SemanticResourceNavigatorAttributes {
  const { productSub, userAgent, vendor } = navigator;

  const getOscpu = (): string | undefined => {
    if (!('oscpu' in navigator)) {
      return;
    }

    try {
      return validateString(navigator.oscpu);
    } catch (_err: unknown) {
      // Fail gracefully.
      return;
    }
  };

  const oscpu: string | undefined = getOscpu();
  return {
    [ATTR_OS_DESCRIPTION]: oscpu,
    [ATTR_OS_NAME]: mapOscpuToName(oscpu),
    [ATTR_OS_TYPE]: mapOscpuToType(oscpu),
    [ATTR_WEBENGINE_DESCRIPTION]: userAgent,
    [ATTR_WEBENGINE_NAME]: vendor,
    [ATTR_WEBENGINE_VERSION]: productSub,
  };
}
