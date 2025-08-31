import { Router, Request, Response } from 'express';
import { TaskService } from '../services/TaskService'; // Import the service class
import { validate, validateParams } from '../middleware/validationMiddleware';
import { createTaskSchema, updateTaskSchema, taskIdSchema } from '../schemas/validationSchemas';

export const taskRouter = Router();

const taskService = new TaskService();

// Create a new task with validation
taskRouter.post('/task', validate(createTaskSchema), async (req: Request, res: Response) => {
  try {
    const newTask = await taskService.createTask(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).send('Error creating task');
  }
});

// Get all tasks
taskRouter.get('/task', async (req: Request, res: Response) => {
  try {
    const allTasks = await taskService.getAllTasks();
    res.json(allTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Error fetching tasks');
  }
});

// Get a single task by ID with validation
taskRouter.get('/task/:id', validateParams(taskIdSchema), async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await taskService.getTaskById(id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).send('Task not found');
    }
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).send('Error fetching task');
  }
});

// Update an existing task with validation
taskRouter.put(
  '/task/:id',
  validateParams(taskIdSchema),
  validate(updateTaskSchema),
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const updatedTask = await taskService.updateTask(id, req.body);
      if (updatedTask) {
        res.json(updatedTask);
      } else {
        res.status(404).send('Task not found');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).send('Error updating task');
    }
  },
);

// Delete a task with validation
taskRouter.delete('/task/:id', validateParams(taskIdSchema), async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedTask = await taskService.deleteTask(id);
    if (deletedTask) {
      res.json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).send('Task not found');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).send('Error deleting task');
  }
});

export default taskRouter;
