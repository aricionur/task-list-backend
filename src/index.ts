import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import cors from "cors";

import { PORT, API_VERSION } from "./constants";
import { initializeDatabase } from "./db/createTables";
import { logError } from "./logging/logger";
import { checkDatabaseConnection } from "./db/dbConnection";
import { TaskService } from "./services/TaskService";
import { createTaskRouter } from "./routes/taskRoutes";

checkDatabaseConnection();
initializeDatabase();

const app = express();

// Load OpenAPI specification from YAML file using an absolute path
const openApiDocument = yaml.load(fs.readFileSync(path.join(__dirname, "../openapi.yaml"), "utf8")) as object;

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("API Version: " + API_VERSION);
});

// Middleware to parse JSON
app.use(express.json());

// Register routes
const taskService = new TaskService();
app.use(`/${API_VERSION}`, createTaskRouter(taskService));

// Register a generic error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logError("Unhandled server error", err); // Send the error to a cloud service for monitoring
  res.status(500).send("Oops! Something went wrong!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
