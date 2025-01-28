import type LR from 'logrocket';

export type LogRocket = typeof LR;

export type LogRocketOptions = Parameters<LogRocket['init']>[1] extends
  | infer U
  | undefined
  ? U
  : never;

export type LogRocketRequest = Parameters<
  Required<Required<LogRocketOptions>['network']>['requestSanitizer']
>[0];

export type LogRocketResponse = Parameters<
  Required<Required<LogRocketOptions>['network']>['responseSanitizer']
>[0];
