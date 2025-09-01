import request from "supertest";
import express from "express";
import { createTaskRouter } from "../../src/routes/taskRoutes";
import { Status, Task } from "../../src/types";
import { API_VERSION } from "../../src/constants";

describe("taskRouter", () => {
  // Mock implementations for TaskService methods
  const mockCreateTask = jest.fn();
  const mockGetAllTasks = jest.fn();
  const mockGetTaskById = jest.fn();
  const mockUpdateTask = jest.fn();
  const mockDeleteTask = jest.fn();

  // Build the Express app with a mocked TaskService
  const app = express();
  app.use(express.json());
  app.use(
    `/${API_VERSION}`,
    createTaskRouter({
      createTask: mockCreateTask,
      getAllTasks: mockGetAllTasks,
      getTaskById: mockGetTaskById,
      updateTask: mockUpdateTask,
      deleteTask: mockDeleteTask,
    }),
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // POST /v1/task
  it("should create a new task", async () => {
    // Arrange
    const newTask: Task = {
      title: "New Task",
      status: Status.Todo,
      description: "This is a test task",
      dueDate: "2025-12-31",
    };
    const createdTask = { id: 1, ...newTask };
    mockCreateTask.mockResolvedValue(createdTask);

    // Act
    const response = await request(app).post(`/${API_VERSION}/task`).send(newTask);

    // Assert
    expect(response.status).toBe(201);
    expect(mockCreateTask).toHaveBeenCalledWith(newTask);
    expect(response.body).toEqual(createdTask);
  });

  // GET /v1/task
  it("should get all tasks", async () => {
    // Arrange
    const allTasks = [
      { id: 1, title: "Task 1", status: Status.Todo, description: "First task", dueDate: "2025-12-31" },
      { id: 2, title: "Task 2", status: Status.InProgress, description: "Second task", dueDate: "2026-01-15" },
    ];
    mockGetAllTasks.mockResolvedValue(allTasks);

    // Act
    const response = await request(app).get(`/${API_VERSION}/task`);

    // Assert
    expect(response.status).toBe(200);
    expect(mockGetAllTasks).toHaveBeenCalled();
    expect(response.body).toEqual(allTasks);
  });

  // GET /v1/task/:id
  it("should get a task by ID", async () => {
    // Arrange
    const task = {
      id: 1,
      title: "Existing Task",
      status: Status.Done,
      description: "Finished task",
      dueDate: "2025-05-01",
    };
    mockGetTaskById.mockResolvedValue(task);

    // Act
    const response = await request(app).get(`/${API_VERSION}/task/1`);

    // Assert
    expect(response.status).toBe(200);
    expect(mockGetTaskById).toHaveBeenCalledWith(1);
    expect(response.body).toEqual(task);
  });

  it("should return 404 for a non-existent task", async () => {
    // Arrange
    const id = 999;
    mockGetTaskById.mockResolvedValue(null);

    // Act
    const response = await request(app).get(`/${API_VERSION}/task/${id}`);

    // Assert
    expect(response.status).toBe(404);
    expect(mockGetTaskById).toHaveBeenCalledWith(id);
  });

  // PUT /v1/task/:id
  it("should update a task", async () => {
    // Arrange
    const updatedTask = {
      id: 1,
      title: "Updated Task",
      status: Status.InProgress,
      description: "Updated description",
      dueDate: "2025-11-11",
    };
    mockUpdateTask.mockResolvedValue(updatedTask);

    // Act
    const response = await request(app)
      .put(`/${API_VERSION}/task/1`)
      .send({ title: "Updated Task", description: "Updated description" });

    // Assert
    expect(response.status).toBe(200);
    expect(mockUpdateTask).toHaveBeenCalledWith(1, { title: "Updated Task", description: "Updated description" });
    expect(response.body).toEqual(updatedTask);
  });

  it("should return 404 when updating non-existent task", async () => {
    // Arrange
    const id = 999;
    mockUpdateTask.mockResolvedValue(null);

    // Act
    const response = await request(app).put(`/${API_VERSION}/task/${id}`).send({ title: "Does Not Exist" });

    // Assert
    expect(response.status).toBe(404);
    expect(mockUpdateTask).toHaveBeenCalledWith(id, { title: "Does Not Exist" });
  });

  // DELETE /v1/task/:id
  it("should delete a task", async () => {
    // Arrange
    mockDeleteTask.mockResolvedValue({
      id: 1,
      title: "Task to Delete",
      status: Status.Todo,
      description: "To be deleted",
      dueDate: "2025-06-06",
    });

    // Act
    const response = await request(app).delete(`/${API_VERSION}/task/1`);

    // Assert
    expect(response.status).toBe(200);
    expect(mockDeleteTask).toHaveBeenCalledWith(1);
    expect(response.body).toEqual({ message: "Task deleted successfully" });
  });

  it("should return 404 when deleting non-existent task", async () => {
    // Arrange
    const id = 999;
    mockDeleteTask.mockResolvedValue(null);

    // Act
    const response = await request(app).delete(`/${API_VERSION}/task/${id}`);

    // Assert
    expect(response.status).toBe(404);
    expect(mockDeleteTask).toHaveBeenCalledWith(id);
  });
});
