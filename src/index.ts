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
import { initializeDatabase } from "./db/db";
import registerRoutes from "./routes/register";

const app = express();

// Load OpenAPI specification from YAML file using an absolute path
const openApiDocument = yaml.load(fs.readFileSync(path.join(__dirname, "../openapi.yaml"), "utf8")) as object;

// Add Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Add CORS
app.use(cors());

// Add JSON parser
app.use(express.json());

// Initialize the database and then start the server
async function startServer() {
  await initializeDatabase(); // Wait for the database to be ready

  // Register routes
  registerRoutes(app);

  // Add generic error handler
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
