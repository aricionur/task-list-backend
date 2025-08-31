import { Router, Request, Response } from 'express';
import { TaskService } from '../services/TaskService'; // Import the service class
import { validate, validateParams } from '../middleware/validationMiddleware';
import { createTaskSchema, updateTaskSchema, taskIdSchema } from '../schemas/validationSchemas';

export const taskRouter = Router();

const taskService = new TaskService();

// Create a new task with validation
taskRouter.post('/task', validate(createTaskSchema), async (req: Request, res: Response) => {
  throw new Error('ONUR ARICI');

  const newTask = await taskService.createTask(req.body);

  res.status(201).json(newTask);
});

// Get all tasks
taskRouter.get('/task', async (req: Request, res: Response) => {
  const allTasks = await taskService.getAllTasks();

  res.json(allTasks);
});

// Get a single task by ID with validation
taskRouter.get('/task/:id', validateParams(taskIdSchema), async (req: Request, res: Response) => {
  const { id } = req.params;

  const task = await taskService.getTaskById(id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

// Update an existing task with validation
taskRouter.put(
  '/task/:id',
  validateParams(taskIdSchema),
  validate(updateTaskSchema),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const updatedTask = await taskService.updateTask(id, req.body);

    if (updatedTask) res.json(updatedTask);
    else res.status(404).send('Task not found');
  },
);

// Delete a task with validation
taskRouter.delete('/task/:id', validateParams(taskIdSchema), async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedTask = await taskService.deleteTask(id);
  if (deletedTask) {
    res.json({ message: 'Task deleted successfully' });
  } else {
    res.status(404).send('Task not found');
  }
});

export default taskRouter;
