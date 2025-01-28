/// <reference types="@cloudflare/workers-types" />
import { MetricName } from '../constants/metric-name.js';
import type CspFetchHandler from '../csp-fetch-handler.js';
import isStaticPathname from '../utils/is-static-pathname.js';
import mapPathnameToProjectId from '../utils/map-pathname-to-project-id.js';
import MethodNotAllowedResponse from '../utils/method-not-allowed-response.js';
import NotFoundResponse from '../utils/not-found-response.js';
import handleGet from './handle-get.js';
import handleOptions from './handle-options.js';
import handlePost from './handle-post.js';
import handleStaticPathname from './handle-static-pathname.js';

export default async function handleFetchRequest(
  this: CspFetchHandler,
): Promise<Response> {
  // Static responses
  if (isStaticPathname(this.requestPathname)) {
    return handleStaticPathname.call(this, this.requestPathname);
  }

  // Project pathnames
  const projectId: number = mapPathnameToProjectId(this.requestPathname);
  if (Number.isNaN(projectId)) {
    const error = new Error(
      `The pathname "${this.requestPathname}" does not exist.`,
      {
        cause: this.requestPathname,
      },
    );

    this.logError(error);
    this.emitPublicMetric(MetricName.InvalidPathname, {
      pathname: this.requestPathname,
    });

    return new NotFoundResponse(this.requestPathname);
  }

  switch (this.requestMethod) {
    case 'GET':
      return await handleGet.call(this, projectId);

    case 'OPTIONS':
      return await handleOptions.call(this, projectId);

    case 'POST':
      return await handlePost.call(this, projectId);
  }

  this.emitPublicMetric(MetricName.MethodNotAllowed, {
    method: this.requestMethod,
  });

  return new MethodNotAllowedResponse(this.requestMethod);
}
