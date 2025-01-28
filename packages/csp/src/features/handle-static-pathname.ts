import { FaviconIcoResponse, RobotsTxtResponse } from 'cloudflare-utils';
import { MetricName } from '../constants/metric-name.js';
import { StaticPathname } from '../constants/static-pathname.js';
import type CspFetchHandler from '../csp-fetch-handler.js';

export default function handleStaticPathname(
  this: CspFetchHandler,
  pathname: StaticPathname,
): Response {
  switch (pathname) {
    case StaticPathname.Favicon: {
      this.emitPublicMetric(MetricName.Favicon);
      return new FaviconIcoResponse();
    }

    case StaticPathname.Robots: {
      this.emitPublicMetric(MetricName.RobotsTxt);
      return new RobotsTxtResponse();
    }
  }
}
