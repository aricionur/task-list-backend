import dotenv from "dotenv";
dotenv.config({ path: "./.env", quiet: true });

jest.mock("../src/logging/providers/sentryClient", () => {
  return {
    SentryClient: class {
      async logError(message: string, error: any): Promise<void> {
        // do nothing in tests
      }
    },
  };
});
