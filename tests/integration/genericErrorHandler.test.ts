import express, { Request, Response, NextFunction } from "express";
import request from "supertest";
import { API_VERSION } from "../../src/constants";
import * as logger from "../../src/logging/logger"; // import the module for jest.spyOn

describe("Generic Error Handler", () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Route that intentionally throws
    app.get(`/${API_VERSION}/error-test`, (req: Request, res: Response, next: NextFunction) => {
      throw new Error("Test error");
    });

    // Generic error handler
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      logger.logError("Unhandled server error", err);
      res.status(500).send("Oops! Something went wrong!");
    });
  });

  it("should return 500 and call logError when route throws", async () => {
    // Spy on logError
    const logSpy = jest.spyOn(logger, "logError").mockImplementation(async () => Promise.resolve());

    const response = await request(app).get(`/${API_VERSION}/error-test`);

    expect(response.status).toBe(500);
    expect(response.text).toBe("Oops! Something went wrong!");
    expect(logSpy).toHaveBeenCalledWith("Unhandled server error", expect.any(Error));

    logSpy.mockRestore();
  });
});
