import { TaskService } from "../../src/services/TaskService";
import pool from "../../src/db/pool";
import { Status, Task } from "../../src/types";

// Mock the entire pool module
jest.mock("../../src/db/pool", () => ({
  query: jest.fn(),
}));

describe("TaskService", () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
    (pool.query as jest.Mock).mockClear();
  });

  // Test for createTask
  it("should create a new task", async () => {
    // Arrange
    const mockTask: Task = { title: "Test Task", status: Status.Todo };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [{ id: 1, ...mockTask }] });

    // Act
    const newTask = await taskService.createTask(mockTask);

    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO tasks (title, description, status, due_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [mockTask.title, undefined, mockTask.status, undefined],
    );
    expect(newTask).toEqual({ id: 1, ...mockTask });
  });

  // Test for getAllTasks
  it("should retrieve all tasks", async () => {
    // Arrange
    const mockTasks = [
      { id: 1, title: "Task 1", status: Status.Todo },
      { id: 2, title: "Task 2", status: Status.InProgress },
    ];
    (pool.query as jest.Mock).mockResolvedValue({ rows: mockTasks });

    // Act
    const tasks = await taskService.getAllTasks();

    // Assert
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM tasks");
    expect(tasks).toEqual(mockTasks);
  });

  // Test for getTaskById
  it("should retrieve a single task by id", async () => {
    // Arrange
    const mockTask = { id: 1, title: "Task 1", status: Status.Todo };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockTask] });

    // Act
    const task = await taskService.getTaskById(1);

    // Assert
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM tasks WHERE id = $1", [1]);
    expect(task).toEqual(mockTask);
  });

  // Test for a non-existent task
  it("should return null if task not found", async () => {
    // Arrange
    (pool.query as jest.Mock).mockResolvedValue({ rows: [] });

    // Act
    const task = await taskService.getTaskById(999);

    // Assert
    expect(task).toBeNull();
  });

  // Test for deleteTask
  it("should delete a task by id", async () => {
    // Arrange
    const mockTask = { id: 1, title: "Task 1", status: Status.Todo };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockTask] });

    // Act
    const deletedTask = await taskService.deleteTask(1);

    // Assert
    expect(pool.query).toHaveBeenCalledWith("DELETE FROM tasks WHERE id = $1 RETURNING *", [1]);
    expect(deletedTask).toEqual(mockTask);
  });
});
