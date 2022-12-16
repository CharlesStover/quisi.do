export type {
  AwsRum,
  AwsRumConfig,
  ClientBuilder,
  PageIdFormat,
  PartialCookieAttributes,
  Plugin,
  Telemetry,
} from 'aws-rum-web';
export { default as AwsRumProvider } from './components/aws-rum-provider';
export { default as withAwsRum } from './hocs/with-aws-rum';
export { default as withRecordError } from './hocs/with-record-error';
export { default as useAwsRum } from './hooks/use-aws-rum';
export { default as useRecordError } from './hooks/use-record-error';