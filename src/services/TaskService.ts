import { DataSource } from "typeorm";
import { AppDataSource } from "../db/dataSource";
import { CreateTask, Task } from "../entity/Task";

export class TaskService {
  private taskRepository;

  constructor(dataSource: DataSource) {
    this.taskRepository = dataSource.getRepository(Task);
  }

  /**
   * Creates a new task in the database.
   * @param task - The data for the new task.
   * @returns The created task object.
   */
  async createTask(task: CreateTask) {
    const newTask = this.taskRepository.create(task);
    return await this.taskRepository.save(newTask);
  }

  /**
   * Retrieves all tasks from the database.
   * @returns An array of all tasks.
   */
  async getAllTasks() {
    return this.taskRepository.find({ order: { id: "ASC" } });
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

    const mergedTask = this.taskRepository.merge(existingTask, task);
    return await this.taskRepository.save(mergedTask);
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
