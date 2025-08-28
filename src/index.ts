import express, { Request, Response } from 'express';
import taskRouter from './routes/taskRoutes';
import dotenv from 'dotenv';

// Load env file
dotenv.config();

const port = process.env.PORT || 3000;
const apiVersion = 'v1';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('API Version: ' + apiVersion);
});

// Middleware to parse JSON
app.use(express.json());

// Register routes
app.use(`/${apiVersion}`, taskRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
