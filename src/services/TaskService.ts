import pool from '../db/pool';

export class TaskService {
  /**
   * Creates a new task in the database.
   * @param taskData - The data for the new task.
   * @returns The created task object.
   */
  async createTask(taskData: { title: string; description?: string; status?: string; dueDate?: string }) {
    const { title, description, status, dueDate } = taskData;
    const result = await pool.query(
      'INSERT INTO tasks (title, description, status, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, status, dueDate],
    );
    return result.rows[0];
  }

  /**
   * Retrieves all tasks from the database.
   * @returns An array of all tasks.
   */
  async getAllTasks() {
    const result = await pool.query('SELECT * FROM tasks');
    return result.rows;
  }

  /**
   * Retrieves a single task by its ID.
   * @param id - The ID of the task to retrieve.
   * @returns The task object, or null if not found.
   */
  async getTaskById(id: string) {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  /**
   * Updates an existing task by its ID.
   * @param id - The ID of the task to update.
   * @param taskData - The new data for the task.
   * @returns The updated task object, or null if the task was not found.
   */
  async updateTask(id: string, taskData: { title?: string; description?: string; status?: string; dueDate?: string }) {
    const { title, description, status, dueDate } = taskData;
    const result = await pool.query(
      'UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status), due_date = COALESCE($4, due_date) WHERE id = $5 RETURNING *',
      [title, description, status, dueDate, id],
    );
    return result.rows[0] || null;
  }

  /**
   * Deletes a task by its ID.
   * @param id - The ID of the task to delete.
   * @returns The deleted task object, or null if the task was not found.
   */
  async deleteTask(id: string) {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
  }
}
