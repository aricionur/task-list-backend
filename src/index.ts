import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import cors from "cors";

import { PORT, API_VERSION } from "./constants";
import { logError } from "./logging/logger";
import { createTaskRouter } from "./routes/taskRoutes";
import { TaskService } from "./services/TaskService";
import { initializeDatabase } from "./db/db";

const app = express();

// Load OpenAPI specification from YAML file using an absolute path
const openApiDocument = yaml.load(fs.readFileSync(path.join(__dirname, "../openapi.yaml"), "utf8")) as object;

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Add cors middleware
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Initialize the database and then start the server
async function startServer() {
  await initializeDatabase(); // Wait for the database to be ready

  // Create service instance after the database connection is established
  const taskService = new TaskService();

  // Register routes
  app.use(`/${API_VERSION}`, createTaskRouter(taskService));

  // Register a generic error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    logError("Unhandled server error", err);
    res.status(500).send("Oops! Something went wrong!");
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
