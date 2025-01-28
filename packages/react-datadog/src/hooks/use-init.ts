import type { RumInitConfiguration, datadogRum } from '@datadog/browser-rum';
import { useEffect, useRef, type RefObject } from 'react';
import useDatadogRum from './use-datadog-rum.js';

interface Props {
  readonly enabled: boolean;
  readonly rumInitConfiguration: RumInitConfiguration;
}

export default function useInit({
  enabled,
  rumInitConfiguration,
}: Props): void {
  // Contexts
  const rum: typeof datadogRum = useDatadogRum();

  // States
  const lastRumInitConfiguration: RefObject<RumInitConfiguration | null> =
    useRef(null);

  // Effects
  useEffect((): void => {
    if (!enabled) {
      return;
    }

    /**
     *   When using React in both strict and development modes, effect
     * fire twice. This condition fixes the Datadog error, "Datadog Browser SDK:
     * SDK is loaded more than once. This is unsupported and might have
     * unexpected behavior."
     */
    /* istanbul ignore if -- @preserve */
    if (lastRumInitConfiguration.current === rumInitConfiguration) {
      return;
    }

    lastRumInitConfiguration.current = rumInitConfiguration;
    rum.init(rumInitConfiguration);
  }, [enabled, rum, rumInitConfiguration]);
}
