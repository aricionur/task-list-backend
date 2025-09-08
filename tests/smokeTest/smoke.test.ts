import request from "supertest";
import express from "express";
import registerRoutes from "../../src/routes/register";
import { API_VERSION } from "../../src/constants";

describe("API Smoke Test", () => {
  let app;

  beforeAll(() => {
    // Arrange
    app = express();
    app.use(express.json());
    registerRoutes(app);
  });

  it("should respond on /", async () => {
    // Act
    const response = await request(app).get("/");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ "apiVersion:": API_VERSION });
  });

  it("should respond on /task endpoint", async () => {
    // Act
    const res = await request(app).get("/v1/task");

    // Assert
    expect(res.status).toBeGreaterThanOrEqual(200);
  });
});
