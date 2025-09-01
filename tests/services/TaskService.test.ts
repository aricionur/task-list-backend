/**
 * Implement AAA test pattern for best and cleanest testing.
 */

import { TaskService } from "../../src/services/TaskService";
import pool from "../../src/db/pool";
import { Status } from "../../src/types";

// Mock the entire pool module
jest.mock("../../src/db/pool", () => ({
  query: jest.fn(),
}));

describe("TaskService", () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
    // Clear mock calls before each test
    (pool.query as jest.Mock).mockClear();
  });

  // Test for createTask
  it("should create a new task", async () => {
    const mockTask = { title: "Test Task", status: Status.Todo };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockTask] });

    const newTask = await taskService.createTask(mockTask);

    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO tasks (title, description, status, due_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [mockTask.title, undefined, mockTask.status, undefined],
    );
    expect(newTask).toEqual(mockTask);
  });

  // Test for getAllTasks
  it("should retrieve all tasks", async () => {
    const mockTasks = [
      { id: "1", title: "Task 1" },
      { id: "2", title: "Task 2" },
    ];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockTasks });

    const tasks = await taskService.getAllTasks();

    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM tasks");
    expect(tasks).toEqual(mockTasks);
  });

  // Test for getTaskById
  it("should retrieve a single task by id", async () => {
    const mockTask = { id: "1", title: "Task 1" };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockTask] });

    const task = await taskService.getTaskById("1");

    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM tasks WHERE id = $1", ["1"]);
    expect(task).toEqual(mockTask);
  });

  // Test for a non-existent task
  it("should return null if task not found", async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    const task = await taskService.getTaskById("999");

    expect(task).toBeNull();
  });

  // Test for deleteTask
  it("should delete a task by id", async () => {
    const mockTask = { id: "1", title: "Task 1" };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockTask] });

    const deletedTask = await taskService.deleteTask("1");

    expect(pool.query).toHaveBeenCalledWith("DELETE FROM tasks WHERE id = $1 RETURNING *", ["1"]);
    expect(deletedTask).toEqual(mockTask);
  });
});
