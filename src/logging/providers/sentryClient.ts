import * as Sentry from '@sentry/node';
import { SENTRY_DSN } from '../../constants';

Sentry.init({
  dsn: SENTRY_DSN,
});

export class SentryClient {
  async logError(message: string, error: any): Promise<void> {
    Sentry.captureException(error, {
      tags: { custom_message: message },
    });
  }
}
