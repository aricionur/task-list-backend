import { client, v2 } from '@datadog/datadog-api-client';
import { DD_API_KEY, DD_APP_KEY } from '../../constants';

const configuration = client.createConfiguration({
  authMethods: {
    apiKeyAuth: DD_API_KEY,
    appKeyAuth: DD_APP_KEY,
  },
});

const apiInstance = new v2.LogsApi(configuration);

export class DatadogClient {
  async logError(message: string, error: any): Promise<void> {
    const log = {
      message: message,
      status: 'error',
      ddsource: 'nodejs-app',
      ddtags: 'env:production,service:task-api',
      error: {
        kind: error.name,
        stack: error.stack,
      },
    };

    // Send the log to Datadog's API
    try {
      await apiInstance.submitLog({ body: [log] });
    } catch (apiError) {
      console.error('Failed to send log to Datadog:', apiError);
    }
  }
}
