import request from "supertest";
import express from "express";
import { createTaskRouter } from "../../src/routes/taskRoutes";
import { Status } from "../../src/types";
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

  // Test for POST /v1/task
  it("should create a new task", async () => {
    const newTask = { title: "New Task", status: Status.Todo };
    const createdTask = { id: "1", ...newTask };
    mockCreateTask.mockResolvedValue(createdTask);

    const response = await request(app).post(`/${API_VERSION}/task`).send(newTask).expect(201);

    expect(mockCreateTask).toHaveBeenCalledWith(newTask);
    expect(response.body).toEqual(createdTask);
  });

  // Test for GET /v1/task
  it("should get all tasks", async () => {
    const allTasks = [
      { id: "1", title: "Task 1" },
      { id: "2", title: "Task 2" },
    ];
    mockGetAllTasks.mockResolvedValue(allTasks);

    const response = await request(app).get(`/${API_VERSION}/task`).expect(200);

    expect(mockGetAllTasks).toHaveBeenCalled();
    expect(response.body).toEqual(allTasks);
  });

  // Test for GET /v1/task/:id
  it("should get a task by ID", async () => {
    const task = { id: "1", title: "Existing Task" };
    mockGetTaskById.mockResolvedValue(task);

    const response = await request(app).get(`/${API_VERSION}/task/1`).expect(200);

    expect(mockGetTaskById).toHaveBeenCalledWith("1");
    expect(response.body).toEqual(task);
  });

  it("should return 404 for a non-existent task", async () => {
    mockGetTaskById.mockResolvedValue(null);

    await request(app).get(`/${API_VERSION}/task/999`).expect(404);

    expect(mockGetTaskById).toHaveBeenCalledWith("999");
  });

  // Test for PUT /v1/task/:id
  it("should update a task", async () => {
    const updatedTask = { id: "1", title: "Updated Task" };
    mockUpdateTask.mockResolvedValue(updatedTask);

    const response = await request(app).put(`/${API_VERSION}/task/1`).send({ title: "Updated Task" }).expect(200);

    expect(mockUpdateTask).toHaveBeenCalledWith("1", { title: "Updated Task" });
    expect(response.body).toEqual(updatedTask);
  });

  it("should return 404 when updating non-existent task", async () => {
    mockUpdateTask.mockResolvedValue(null);

    await request(app).put(`/${API_VERSION}/task/999`).send({ title: "Does Not Exist" }).expect(404);

    expect(mockUpdateTask).toHaveBeenCalledWith("999", { title: "Does Not Exist" });
  });

  // Test for DELETE /v1/task/:id
  it("should delete a task", async () => {
    mockDeleteTask.mockResolvedValue({ id: "1" });

    const response = await request(app).delete(`/${API_VERSION}/task/1`).expect(200);

    expect(mockDeleteTask).toHaveBeenCalledWith("1");
    expect(response.body).toEqual({ message: "Task deleted successfully" });
  });

  it("should return 404 when deleting non-existent task", async () => {
    mockDeleteTask.mockResolvedValue(null);

    await request(app).delete(`/${API_VERSION}/task/999`).expect(404);

    expect(mockDeleteTask).toHaveBeenCalledWith("999");
  });
});
