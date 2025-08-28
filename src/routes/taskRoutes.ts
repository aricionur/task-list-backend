import { Router, Request, Response } from 'express';

export const taskRouter = Router();

const mockTasks = [
  { id: 1, title: 'mock title - 1', description: 'mock description - 1', status: 'status - 1', dueDate: new Date() },
  { id: 2, title: 'mock title - 2', description: 'mock description - 2', status: 'status - 2', dueDate: new Date() },
];

let id = 1;

// Create a new TASK
taskRouter.post('/task', (req: Request, res: Response) => {
  const newTask = { id: id++, ...req.body };

  mockTasks.push(newTask);
  res.status(201).json(newTask);
});

// Get all items
taskRouter.get('/task', (req, res) => {
  res.json(mockTasks);
});

// Get single TASK by ID
taskRouter.get('/task/:id', (req: Request, res: Response) => {
  const task = mockTasks.find((task) => task.id === parseInt(req.params.id));
  task ? res.json(task) : res.status(404).send('Task not found!');
});

// Update an TASK
taskRouter.put('/task/:id', (req: Request, res: Response) => {
  const task = mockTasks.find((task) => task.id === parseInt(req.params.id));

  if (task) {
    task.status = req.body.status;
    res.json(task);
  } else {
    res.status(404).send('Task not found');
  }
});

// Delete an TASK
taskRouter.delete('/task/:id', (req: Request, res: Response) => {
  const taskIndex = mockTasks.findIndex((task) => task.id === parseInt(req.params.id));

  if (taskIndex !== -1) {
    const deletedItem = mockTasks.splice(taskIndex, 1);
    res.json(deletedItem);
  } else {
    res.status(404).send('Task not found');
  }
});

export default taskRouter;
