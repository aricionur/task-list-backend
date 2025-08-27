import express, { Request, Response } from 'express';
import taskRouter from './routes/taskRoutes';

console.log("** ",process.env.PORT)

const app = express();
const port = process.env.PORT || 3000;
const apiVersion = "v1";

// Middleware to parse JSON
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the backend!');
});

// Register task routes
app.use(`/${apiVersion}`, taskRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


