const PRODUCTION_TEAM = 'GH6CGA8kqwmAfqGsSfolmL';
const TEST_TEAM = '5ETF0avPANSDTgm3hSy8vA';

export default function mapHostnameToHoneycombTeam(hostname: string): string {
  switch (hostname) {
    case 'charlesstover.com':
    case 'quisi.do':
    case 'www.charlesstover.com':
    case 'www.quisi.do':
      return PRODUCTION_TEAM;
    default:
      return TEST_TEAM;
  }
}
