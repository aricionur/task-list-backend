import { Router, Request, Response } from "express";
import { TaskService } from "../services/TaskService";
import { taskRoutes } from "./taskRoutes";
import { API_VERSION } from "../constants";

const router = Router();

// Create services
const taskService = new TaskService();

export const registerRoutes = (app) => {
  taskRoutes(router, taskService);

  app.use(`/${API_VERSION}`, router);

  // Main Route
  app.use("/", (req: Request, res: Response) => {
    res.json({ "apiVersion:": API_VERSION });
  });
};

export default registerRoutes;
