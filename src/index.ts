import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import { PORT, API_VERSION } from "./constants";
import { initializeDatabase } from "./db/createTables";
import { logError } from "./logging/logger";
import { checkDatabaseConnection } from "./db/dbConnection";

import { TaskService } from "./services/TaskService";
import { createTaskRouter } from "./routes/taskRoutes";

checkDatabaseConnection();
initializeDatabase();

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("API Version: " + API_VERSION);
});

// Middleware to parse JSON
app.use(express.json());

// Register routes
// app.use(`/${API_VERSION}`, taskRouter);
const taskService = new TaskService();
app.use(`/${API_VERSION}`, createTaskRouter(taskService));

// Register a generic error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logError("Unhandled server error", err); // Send the error to the cloud service
  res.status(500).send("Oops! Something went wrong!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
