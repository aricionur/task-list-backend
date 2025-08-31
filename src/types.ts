export interface Task {
  description?: string;
  dueDate?: string;
  status: Status;
  title: string;
}

export enum Status {
  Todo = 'Todo',
  InProgress = 'In Progress',
  Done = 'Done',
}
