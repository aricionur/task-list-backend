import express, { NextFunction, Request, Response } from 'express';
import taskRouter from './routes/taskRoutes';
import { PORT } from './constants';
import { initializeDatabase } from './db/createTables';
import { logError } from './logging/logger';

initializeDatabase();

const apiVersion = 'v1';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('API Version: ' + apiVersion);
});

// Middleware to parse JSON
app.use(express.json());

// Register routes
app.use(`/${apiVersion}`, taskRouter);

// Register a generic error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logError('Unhandled server error', err); // Send the error to the cloud service
  res.status(500).send('Oops! Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
