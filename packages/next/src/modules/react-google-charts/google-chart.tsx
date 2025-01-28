'use client';

import { mapToError } from 'fmrs';
import { useEffect, useRef, type ReactElement, type RefObject } from 'react';
import useShallowMemo from 'use-shallow-memo';
import useEffectEvent from '../../hooks/use-effect-event.js';
import noop from '../../utils/noop.js';
import type { ChartOptions } from './chart-options.js';
import type { Chart } from './chart.js';
import loadGoogleChartsLoader from './load-google-charts-loader.js';

interface Props<C extends Chart> {
  readonly chart: C;
  readonly className?: string | undefined;
  readonly data: readonly (readonly (number | string)[])[];
  readonly headings?: readonly string[] | undefined;
  readonly onError?: ((error: Error) => void) | undefined;
  readonly options?: ChartOptions<C> | undefined;
  readonly packages?: readonly string[] | undefined;
}

export default function GoogleChart<C extends Chart>({
  chart,
  className,
  data: dataProp,
  headings: headingsProp,
  onError,
  options: optionsProp = {} as ChartOptions<C>,
  packages: packagesProp = [],
}: Props<C>): ReactElement {
  // States
  const elementRef: RefObject<HTMLDivElement | null> = useRef(null);
  const handleError = useEffectEvent(onError ?? noop);
  const headings = useShallowMemo(headingsProp);
  const packages = useShallowMemo(packagesProp);

  // Effects
  const dataStr: string = JSON.stringify(dataProp);
  const optionsStr: string = JSON.stringify(optionsProp);
  useEffect((): void => {
    const element: HTMLDivElement | null = elementRef.current;
    if (element === null) {
      return;
    }

    const data: typeof dataProp = JSON.parse(dataStr) as typeof dataProp;
    const options: typeof optionsProp = JSON.parse(
      optionsStr,
    ) as typeof optionsProp;

    const handleDraw = ({
      arrayToDataTable,
      [chart]: Chart,
    }: typeof google.visualization): void => {
      const getDataTable = (): google.visualization.DataTable => {
        if (typeof headings !== 'undefined') {
          return arrayToDataTable([headings, ...data], false);
        }
        return arrayToDataTable([...data], true);
      };

      const dataTable: google.visualization.DataTable = getDataTable();
      const chart = new Chart(element);
      // @ts-expect-error TypeScript ex[ects `chart` to be all `C`.
      chart.draw(dataTable, options ?? {});
    };

    loadGoogleChartsLoader()
      .then((googleObj: typeof google): Promise<void> => {
        /**
         *   Google does not document whether awaiting `charts.load` is
         * equivalent to `setOnLoadCallback`.
         */
        const promise: Promise<void> = googleObj.charts.load('current', {
          packages: [...packages],
        });

        googleObj.charts.setOnLoadCallback((): void => {
          handleDraw(googleObj.visualization);
        });

        /**
         *   We want to return the `charts.load` promise so that we can `catch`
         * any errors.
         */
        return promise;
      })
      .catch((err: unknown): void => {
        const error: Error = mapToError(err);
        handleError(error);
      });
  }, [chart, dataStr, handleError, headings, optionsStr, packages]);

  return <div className={className} ref={elementRef} />;
}
