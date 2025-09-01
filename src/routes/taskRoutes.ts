import { Router, Request, Response } from "express";
import { TaskService } from "../services/TaskService";
import { validate, validateParams } from "../middleware/validationMiddleware";
import { createTaskSchema, updateTaskSchema, taskIdSchema } from "../schemas/validationSchemas";

export function createTaskRouter(taskService: TaskService) {
  const taskRouter = Router();

  // Create a new task with validation
  taskRouter.post("/task", validate(createTaskSchema), async (req: Request, res: Response) => {
    const newTask = await taskService.createTask(req.body);

    res.status(201).json(newTask);
  });

  // Get all tasks
  taskRouter.get("/task", async (req: Request, res: Response) => {
    const allTasks = await taskService.getAllTasks();

    res.json(allTasks);
  });

  // Get a single task by ID with validation
  taskRouter.get("/task/:id", validateParams(taskIdSchema), async (req: Request, res: Response) => {
    const { id } = req.params;
    const task = await taskService.getTaskById(+id);

    task ? res.json(task) : res.status(404).send("Task not found");
  });

  // Update an existing task with validation
  taskRouter.put(
    "/task/:id",
    validateParams(taskIdSchema),
    validate(updateTaskSchema),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const updatedTask = await taskService.updateTask(+id, req.body);

      updatedTask ? res.json(updatedTask) : res.status(404).send("Task not found");
    },
  );

  // Delete a task with validation
  taskRouter.delete("/task/:id", validateParams(taskIdSchema), async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedTask = await taskService.deleteTask(+id);

    deletedTask ? res.json({ message: "Task deleted successfully" }) : res.status(404).send("Task not found");
  });

  return taskRouter;
}
