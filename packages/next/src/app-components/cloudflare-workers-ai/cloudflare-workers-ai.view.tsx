import { type ReactElement } from 'react';
import Container from '../../components/container';
// import Div from '../../components/div';
// import useCloudflareWorkersAi from './cloudflare-workers-ai.hook';
// import Actions from './components/actions';
// import Form from './components/form';
// import Subheader from './components/subheader';
import type Fetch from './types/fetch';
// import handleSubmit from './utils/handle-submit';

interface Props {
  readonly onFetch: Fetch;
}

export default function CloudflareWorkersAiFeature(
  _props: Props,
): ReactElement {
  /*
  const {
    apiToken,
    apiTokenStatus,
    handleApiTokenChange,
    handleFormChange,
    handleModelChange,
    handleRunClick,
    inputs,
    model,
    result,
  } = useCloudflareWorkersAi(onFetch);

  return (
    <form action="#" method="POST" onSubmit={handleSubmit}>
      <Container
        actions={<Actions onRunClick={handleRunClick} />}
        header="Cloudflare Workers AI"
        subheader={
          <Subheader
            apiToken={apiToken}
            apiTokenStatus={apiTokenStatus}
            onApiTokenChange={handleApiTokenChange}
            onModelChange={handleModelChange}
            model={model}
          />
        }
      >
        {initiated && <>Initiated</>}
        {loading && <LoadingIcon />}
        {error && <>{JSON.stringify(error)}</>}
        <Form inputs={inputs} model={model} onChange={handleFormChange} />
        <Div>
          <h3>Response</h3>
          <textarea disabled>{result}</textarea>
        </Div>
      </Container>
    </form>
  );
  */
  return (
    <Container header="Cloudflare Workers AI">
      This page may or may not exist. 🤔
    </Container>
  );
}