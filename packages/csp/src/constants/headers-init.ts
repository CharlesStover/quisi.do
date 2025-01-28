export const HEADERS_INIT: HeadersInit = {
  'access-control-allow-origin': '*',

  // Technical debt: After launch, let's set this to like 5 or 10 minutes.
  'access-control-max-age': '0',
};
