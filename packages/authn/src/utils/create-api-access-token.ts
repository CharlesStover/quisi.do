import formUrlEncoded from 'form-urlencoded';
import ErrorCode from '../constants/error-code.js';
import StatusCode from '../constants/status-code.js';
import USER_AGENT from '../constants/user-agent.js';
import createPatreonError from './create-patreon-error.js';
import isObject from './is-object.js';
import mapReadableStreamToString from './map-readable-stream-to-string.js';
import parseJson from './parse-json.js';

const HTTP_REDIRECTION = 300;
const HTTP_SUCCESSFUL = 200;
const HEADERS: Headers = new Headers({
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'User-Agent': USER_AGENT,
});

export default async function createApiAccessToken(
  host: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  code: string,
  assert: (
    assertion: boolean,
    message: string,
    code: ErrorCode,
    status: StatusCode,
    data?: unknown,
  ) => asserts assertion,
): Promise<string> {
  const response: Response = await fetch(`${host}/api/oauth2/token`, {
    // compress: false,
    // credentials: 'include',
    headers: HEADERS,
    method: 'POST',
    body: formUrlEncoded({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  });

  if (
    response.status < HTTP_SUCCESSFUL ||
    response.status >= HTTP_REDIRECTION
  ) {
    assert(
      response.body !== null,
      'Expected Patreon OAuth token error to have a body.',
      ErrorCode.MissingPatreonOAuthTokenErrorBody,
      StatusCode.BadGateway,
    );

    const body: string = await mapReadableStreamToString(response.body);
    const json: unknown = parseJson(
      body,
      ErrorCode.NonJsonPatreonOAuthTokenErrorBody,
    );

    assert(
      isObject(json),
      'Expected Patreon OAuth token error to be an object.',
      ErrorCode.NonObjectPatreonOAuthTokenError,
      StatusCode.BadGateway,
      json,
    );

    assert(
      'error' in json,
      'Expected Patreon OAuth token error to have a code.',
      ErrorCode.MissingPatreonOAuthTokenErrorCode,
      StatusCode.BadGateway,
      json,
    );

    throw createPatreonError({
      assert,
      clientId,
      code,
      json,
      status: response.status,
    });
  }

  const json: unknown = await response.json();
  assert(
    isObject(json),
    `Expected \`${host}/api/oauth2/token\` to be an object, but received ${typeof json}.`,
    ErrorCode.NonObjectPatreonOAuthTokenResponse,
    StatusCode.BadGateway,
    json,
  );

  assert(
    'access_token' in json,
    "Expected Patreon's OAuth response to have an access token.",
    ErrorCode.MissingPatreonOAuthAccessToken,
    response.status,
    json,
  );

  assert(
    typeof json.access_token === 'string',
    "Expected Patreon's OAuth access token to be a string.",
    ErrorCode.NonStringPatreonOAuthAccessToken,
    response.status,
    json,
  );

  return json.access_token;
}
