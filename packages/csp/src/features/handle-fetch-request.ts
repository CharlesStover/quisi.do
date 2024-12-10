/// <reference types="@cloudflare/workers-types" />
import handleStaticPathname from '../constants/handle-static-pathname.js';
import { MetricName } from '../constants/metric-name.js';
import type CspFetchHandler from '../csp-fetch-handler.js';
import InvalidPathnameResponse from '../utils/invalid-pathname-response.js';
import isAllowedMethod from '../utils/is-allowed-method.js';
import isStaticPathname from '../utils/is-static-pathname.js';
import mapPathnameToProjectId from '../utils/map-pathname-to-project-id.js';
import MethodNotAllowedResponse from '../utils/method-not-allowed-response.js';
import Response from '../utils/response.js';
import handleGet from './handle-get.js';
import handleOptions from './handle-options.js';
import handlePost from './handle-post.js';

export default async function handleFetchRequest(
  this: CspFetchHandler,
): Promise<Response> {
  // Method
  if (!isAllowedMethod(this.requestMethod)) {
    this.emitPublicMetric(MetricName.MethodNotAllowed);
    return new MethodNotAllowedResponse();
  }

  // Static responses
  if (isStaticPathname(this.requestPathname)) {
    return handleStaticPathname(this.requestPathname);
  }

  // Project pathnames
  const projectId: number = mapPathnameToProjectId(this.requestPathname);
  if (Number.isNaN(projectId)) {
    this.logError(
      new Error('Invalid pathname', { cause: this.requestPathname }),
    );
    return new InvalidPathnameResponse();
  }

  switch (this.requestMethod) {
    case 'GET':
      return await handleGet.call(this, projectId);

    case 'OPTIONS':
      return await handleOptions.call(this, projectId);

    case 'POST':
      return await handlePost.call(this, projectId);
  }
}
