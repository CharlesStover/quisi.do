import { useQuery } from 'react-query';

interface State {
  readonly data?: Record<string, number[]> | undefined;
  readonly error: unknown;
  readonly isLoading: boolean;
  readonly refetch: () => void;
}

export default function useNpmDownloads(): State {
  const { data, error, isLoading, refetch } = useQuery(
    'npm',
    async (): Promise<Record<string, number[]>> => {
      const response: Response = await fetch(
        process.env.REACT_APP_NPM_DOWNLOADS ??
          'https://npm.cscdn.net/charlesstover.json',
      );
      return response.json();
    },
  );

  return {
    data,
    error,
    isLoading,
    refetch,
  };
}
