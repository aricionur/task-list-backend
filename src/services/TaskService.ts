import { AppDataSource } from "../db/dataSource";
import { Task } from "../entity/Task";

export class TaskService {
  private taskRepository = AppDataSource.getRepository(Task);

  /**
   * Creates a new task in the database.
   * @param task - The data for the new task.
   * @returns The created task object.
   */
  async createTask(task: Task) {
    // The save method handles both creating and updating entities
    const newTask = this.taskRepository.create(task);
    await this.taskRepository.save(newTask);
    return newTask;
  }

  /**
   * Retrieves all tasks from the database.
   * @returns An array of all tasks.
   */
  async getAllTasks() {
    return this.taskRepository.find();
  }

  /**
   * Retrieves a single task by its ID.
   * @param id - The ID of the task to retrieve.
   * @returns The task object, or null if not found.
   */
  async getTaskById(id: number) {
    return this.taskRepository.findOneBy({ id });
  }

  /**
   * Updates an existing task by its ID.
   * @param id - The ID of the task to update.
   * @param task - The new data for the task.
   * @returns The updated task object, or null if the task was not found.
   */
  async updateTask(id: number, task: Partial<Task>) {
    const existingTask = await this.taskRepository.findOneBy({ id });
    if (!existingTask) {
      return null;
    }

    this.taskRepository.merge(existingTask, task);
    const updatedTask = await this.taskRepository.save(existingTask);
    return updatedTask;
  }

  /**
   * Deletes a task by its ID.
   * @param id - The ID of the task to delete.
   * @returns The deleted task object, or null if the task was not found.
   */
  async deleteTask(id: number) {
    const taskToDelete = await this.taskRepository.findOneBy({ id });
    if (!taskToDelete) {
      return null;
    }

    await this.taskRepository.remove(taskToDelete);
    return taskToDelete;
  }
}
