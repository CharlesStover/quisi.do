'use client';

import { AwsRum, type AwsRumConfig } from 'aws-rum-web';
import { type ReactElement, type ReactNode, useMemo } from 'react';
import AwsRumContext from '../../contexts/aws-rum.js';

interface Props extends AwsRumConfig {
  readonly children: ReactNode;
  readonly id: string;
  readonly region:
    | 'af-south-1'
    | 'ap-east-1'
    | 'ap-northeast-1'
    | 'ap-northeast-2'
    | 'ap-northeast-3'
    | 'ap-south-1'
    | 'ap-south-2'
    | 'ap-southeast-1'
    | 'ap-southeast-2'
    | 'ap-southeast-3'
    | 'ca-central-1'
    | 'eu-central-1'
    | 'eu-central-2'
    | 'eu-north-1'
    | 'eu-south-1'
    | 'eu-south-2'
    | 'eu-west-1'
    | 'eu-west-2'
    | 'eu-west-3'
    | 'me-central-1'
    | 'me-south-1'
    | 'sa-east-1'
    | 'us-east-1'
    | 'us-east-2'
    | 'us-west-1'
    | 'us-west-2';
  readonly version: string;
}

export default function AwsRumProvider({
  children,
  id,
  region,
  version,
  ...config
}: Props): ReactElement {
  const client: AwsRum = useMemo(
    (): AwsRum => new AwsRum(id, version, region, config),
    [config, id, region, version],
  );

  return (
    <AwsRumContext.Provider value={client}>{children}</AwsRumContext.Provider>
  );
}
