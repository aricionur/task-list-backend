// import { Router, Request, Response } from 'express';

// export const taskRouter = Router();

// const mockTasks = [
//   { id: 1, title: 'mock title - 1', description: 'mock description - 1', status: 'status - 1', dueDate: new Date() },
// ];

// let id = 2;

// // Create a new TASK
// taskRouter.post('/task', (req: Request, res: Response) => {
//   const newTask = { id: id++, ...req.body };

//   mockTasks.push(newTask);
//   res.status(201).json(newTask);
// });

// // Get all items
// taskRouter.get('/task', (req, res) => {
//   res.json(mockTasks);
// });

// // Get single TASK by ID
// taskRouter.get('/task/:id', (req: Request, res: Response) => {
//   const task = mockTasks.find((task) => task.id === parseInt(req.params.id));
//   task ? res.json(task) : res.status(404).send('Task not found!');
// });

// // Update an TASK
// taskRouter.put('/task/:id', (req: Request, res: Response) => {
//   const task = mockTasks.find((task) => task.id === parseInt(req.params.id));

//   if (task) {
//     task.status = req.body.status;
//     res.json(task);
//   } else {
//     res.status(404).send('Task not found');
//   }
// });

// // Delete an TASK
// taskRouter.delete('/task/:id', (req: Request, res: Response) => {
//   const taskIndex = mockTasks.findIndex((task) => task.id === parseInt(req.params.id));

//   if (taskIndex !== -1) {
//     const deletedItem = mockTasks.splice(taskIndex, 1);
//     res.json(deletedItem);
//   } else {
//     res.status(404).send('Task not found');
//   }
// });

// export default taskRouter;

// src/routes/taskRouter.ts
import { Router, Request, Response } from 'express';
import { TaskService } from '../services/TaskService'; // Import the service class

export const taskRouter = Router();

const taskService = new TaskService();

// Create a new task
taskRouter.post('/task', async (req: Request, res: Response) => {
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

// Get a single task by ID
taskRouter.get('/task/:id', async (req: Request, res: Response) => {
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

// Update an existing task
taskRouter.put('/task/:id', async (req: Request, res: Response) => {
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
});

// Delete a task
taskRouter.delete('/task/:id', async (req: Request, res: Response) => {
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
