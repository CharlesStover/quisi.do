'use client';

import { Fullstory } from 'fullstory-react';
import { type PropsWithChildren, type ReactNode } from 'react';

export default function FullstoryFeature({
  children,
}: PropsWithChildren): ReactNode {
  return (
    <Fullstory
      devMode={process.env.NODE_ENV !== 'production'}
      orgId="o-1X4ZHB-na1"
      startCaptureManually={false}
    >
      {children}
    </Fullstory>
  );
}
