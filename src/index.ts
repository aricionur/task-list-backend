import express, { Request, Response } from 'express';
import taskRouter from './routes/taskRoutes';
import { PORT } from './constants';
import { initializeDatabase } from './db/createTables';

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

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
