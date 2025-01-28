import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { ATTR_SERVICE_NAMESPACE } from '@opentelemetry/semantic-conventions/incubating';
import split from './split.js';

interface Package {
  readonly name: string;
  readonly version: string;
}

const reverse = <T extends readonly unknown[]>(arr: T): T =>
  [...arr].reverse() as unknown as T;

export default function mapPackageToSemanticResourceAttributes({
  name,
  version,
}: Package): Record<
  typeof ATTR_SERVICE_NAME | typeof ATTR_SERVICE_VERSION,
  string
> &
  Partial<Record<typeof ATTR_SERVICE_NAMESPACE, string | undefined>> {
  const [serviceName, serviceNamespace] = reverse(split(name, '/'));
  return {
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_SERVICE_NAMESPACE]: serviceNamespace,
    [ATTR_SERVICE_VERSION]: version,
  };
}
