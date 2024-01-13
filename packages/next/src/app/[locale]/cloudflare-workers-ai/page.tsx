import { type ReactElement } from 'react';
import CloudflareWorkersAi from '../../../features/cloudflare-workers-ai';

/*
const ACCOUNT_IDENTIFIER = 'da0f1e5d73beae3d7bbc796d448766ab';

const handleFetch = async (
  apiToken: string,
  { inputs, model }: ModelState,
): Promise<unknown> => {
  const response: Response = await window.fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_IDENTIFIER}/ai/run/${model}`,
    {
      body: JSON.stringify(inputs),
      method: 'POST',
      // mode: 'no-cors',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  return response.json();
};
*/

export { default as generateStaticParams } from '../../../features/generate-locale-static-params.js';

export default function CloudflareWorkersAiPage(): ReactElement {
  return <CloudflareWorkersAi /*onFetch={handleFetch}*/ />;
}
