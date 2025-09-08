// tests/integration/task.integration.test.ts
import express from "express";
import request from "supertest";
import { initializeTestDatabase, testDataSource } from "../setupTestDB";
import { Task } from "../../src/entity/Task";
import { taskRoutes } from "../../src/routes/taskRoutes";
import { TaskService } from "../../src/services/TaskService";
import { API_VERSION } from "../../src/constants";

describe("Task API Integration Tests (In-Memory DB)", () => {
  let app: express.Application;
  let taskService: TaskService;

  const createTaskPayload = { title: "In-Memory Test Task", status: "Todo" };
  const invalidTaskPayload = { description: "No title or status" };

  // ----------------------------
  // Helper functions
  // ----------------------------
  const postTask = (payload: object) => request(app).post(`/${API_VERSION}/task`).send(payload);

  const getTasks = () => request(app).get(`/${API_VERSION}/task`);

  const putTask = (id: string | number, payload: object) =>
    request(app).put(`/${API_VERSION}/task/${id}`).send(payload);

  const deleteTask = (id: string | number) => request(app).delete(`/${API_VERSION}/task/${id}`);

  beforeAll(async () => {
    // Initialize in-memory DB
    await initializeTestDatabase();
    taskService = new TaskService(testDataSource);

    // Setup Express app
    app = express();
    app.use(express.json());

    // Register routes dynamically with API_VERSION
    const router = express.Router();
    taskRoutes(router, taskService);
    app.use(`/${API_VERSION}`, router);
  });

  afterEach(async () => {
    await testDataSource.getRepository(Task).clear();
  });

  afterAll(async () => {
    await testDataSource.destroy();
  });

  // ----------------------------
  // CRUD Tests
  // ----------------------------
  it("should create a task", async () => {
    const response = await postTask(createTaskPayload);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(createTaskPayload);

    const savedTask = await testDataSource.getRepository(Task).findOneBy({ id: response.body.id });
    expect(savedTask).toBeTruthy();
    expect(savedTask?.title).toBe(createTaskPayload.title);
  });

  it("should return all tasks", async () => {
    await testDataSource.getRepository(Task).save({ title: "Seed Task", status: "Todo" });

    const response = await getTasks();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Seed Task");
  });

  it("should update a task", async () => {
    const task = await testDataSource.getRepository(Task).save({ title: "Old Title", status: "Todo" });

    const response = await putTask(task.id, { title: "New Title" });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("New Title");
  });

  it("should delete a task", async () => {
    const task = await testDataSource.getRepository(Task).save({ title: "Delete Me", status: "Todo" });

    const response = await deleteTask(task.id);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Task deleted successfully" });

    const deleted = await testDataSource.getRepository(Task).findOneBy({ id: task.id });
    expect(deleted).toBeNull();
  });

  // ----------------------------
  // Joi Validation Tests
  // ----------------------------
  describe("Joi Validation Tests", () => {
    it("should fail POST without required fields", async () => {
      const response = await postTask(invalidTaskPayload);

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('"title" is required');
      expect(response.body.errors).toContain('"status" is required');
    });

    it("should fail POST with invalid status", async () => {
      const task = { title: "Task", status: "InvalidStatus" };

      const response = await postTask(task);

      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toContain('"status" must be one of');
    });

    it("should fail PUT with invalid ID", async () => {
      const id = "abc";

      const response = await putTask(id, { title: "New Title" });

      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toContain('"id" must be a number');
    });

    it("should fail PUT with invalid status", async () => {
      const invalidStatusTask = { status: "InvalidStatus" };
      const task = await testDataSource.getRepository(Task).save({ title: "Task", status: "Todo" });

      const response = await putTask(task.id, invalidStatusTask);

      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toContain('"status" must be one of');
    });

    it("should fail DELETE with invalid ID", async () => {
      const id = "abc";

      const response = await deleteTask(id);

      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toContain('"id" must be a number');
    });
  });
});
