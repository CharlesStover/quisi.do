export default async function fetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  return window.fetch(input, init);
}
