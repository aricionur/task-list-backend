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
    // Clear table after each test
    await testDataSource.getRepository(Task).clear();
  });

  afterAll(async () => {
    await testDataSource.destroy();
  });

  // ----------------------------
  //       CRUD tests
  // ----------------------------
  it(`POST /${API_VERSION}/task should create a task`, async () => {
    // ARRANGE
    const payload = { title: "In-Memory Test Task", status: "Todo" };

    // ACT
    const response = await request(app).post(`/${API_VERSION}/task`).send(payload);

    // ASSERT
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(payload);

    // Verify persistence in in-memory DB
    const savedTask = await testDataSource.getRepository(Task).findOneBy({ id: response.body.id });
    expect(savedTask).toBeTruthy();
    expect(savedTask?.title).toBe(payload.title);
  });

  it(`GET /${API_VERSION}/task should return tasks`, async () => {
    // ARRANGE
    await testDataSource.getRepository(Task).save({ title: "Seed Task", status: "Todo" });

    // ACT
    const response = await request(app).get(`/${API_VERSION}/task`);

    // ASSERT
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Seed Task");
  });

  it(`PUT /${API_VERSION}/task/:id should update a task`, async () => {
    // ARRANGE
    const task = await testDataSource.getRepository(Task).save({ title: "Old Title", status: "Todo" });

    // ACT
    const response = await request(app).put(`/${API_VERSION}/task/${task.id}`).send({ title: "New Title" });

    // ASSERT
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("New Title");
  });

  it(`DELETE /${API_VERSION}/task/:id should delete a task`, async () => {
    // ARRANGE
    const task = await testDataSource.getRepository(Task).save({ title: "Delete Me", status: "Todo" });

    // ACT
    const response = await request(app).delete(`/${API_VERSION}/task/${task.id}`);

    // ASSERT
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Task deleted successfully" });

    // ACT
    const deleted = await testDataSource.getRepository(Task).findOneBy({ id: task.id });

    // ASSERT
    expect(deleted).toBeNull();
  });

  // ----------------------------
  //    Joi Validation Tests
  // ----------------------------
  describe("Joi Validation Tests", () => {
    it(`POST /${API_VERSION}/task should fail without required fields`, async () => {
      const invalidPayload = { description: "No title or status" };

      const response = await request(app).post(`/${API_VERSION}/task`).send(invalidPayload);

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('"title" is required');
      expect(response.body.errors).toContain('"status" is required');
    });

    it(`POST /${API_VERSION}/task should fail with invalid status`, async () => {
      const invalidPayload = { title: "Task", status: "InvalidStatus" };

      const response = await request(app).post(`/${API_VERSION}/task`).send(invalidPayload);

      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toContain('"status" must be one of');
    });

    it(`PUT /${API_VERSION}/task/:id should fail with invalid ID`, async () => {
      const id = "abc";
      const task = { title: "New Title" };

      const response = await request(app).put(`/${API_VERSION}/task/${id}`).send(task);

      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toContain('"id" must be a number');
    });

    it(`PUT /${API_VERSION}/task/:id should fail with invalid status`, async () => {
      const task = await testDataSource.getRepository(Task).save({ title: "Task", status: "Todo" });

      const response = await request(app).put(`/${API_VERSION}/task/${task.id}`).send({ status: "InvalidStatus" });

      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toContain('"status" must be one of');
    });

    it(`DELETE /${API_VERSION}/task/:id should fail with invalid ID`, async () => {
      const id = "abc";

      const response = await request(app).delete(`/${API_VERSION}/task/${id}`);

      expect(response.status).toBe(400);
      expect(response.body.errors[0]).toContain('"id" must be a number');
    });
  });
});
