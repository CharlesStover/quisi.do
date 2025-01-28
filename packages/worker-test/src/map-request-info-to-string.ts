export default function mapRequestInfoToString(info: RequestInfo): string {
  if (typeof info === 'string') {
    return info;
  }

  return info.url;
}
