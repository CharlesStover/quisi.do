import {
  TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS,
  TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS,
} from '@opentelemetry/semantic-conventions';

export default function getTelemetrySdkLanguage(): string {
  if (typeof window === 'undefined') {
    return TELEMETRY_SDK_LANGUAGE_VALUE_NODEJS;
  }

  return TELEMETRY_SDK_LANGUAGE_VALUE_WEBJS;
}
