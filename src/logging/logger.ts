import { SentryClient } from './providers/sentryClient';
import { DatadogClient } from './providers/datadogClient';
import { NODE_ENV } from '../constants';

interface LoggingClient {
  logError: (message: string, error: any) => Promise<void>;
}

const isDevelopment = NODE_ENV === 'development';

const activeClient: LoggingClient = isDevelopment
  ? {
      // Local logger for development
      logError: async (message, error) => {
        console.error(message, error);
      },
    }
  : new SentryClient(); // Sentry in production

// to Switch to Datadog just update above line...
// new DatadogClient();

// **** Add here other logging cloud SaaS if need in future easily...  ****

/**
 * Public function to log errors to the configured cloud service.
 * @param message A custom message describing the error.
 * @param error The error object to be logged.
 */
export async function logError(message: string, error: any) {
  await activeClient.logError(message, error);
}
