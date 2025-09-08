import { AppDataSource } from "../../../src/db/dataSource";
import { TaskService } from "../../../src/services/TaskService";
import { CreateTask, Task } from "../../../src/entity/Task";
import { DataSource } from "typeorm";

describe("TaskService", () => {
  let taskService: TaskService;
  let mockTaskRepository: any;
  let mockDataSource: Partial<DataSource>;

  beforeEach(() => {
    mockTaskRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
    };

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockTaskRepository),
    };

    // Pass the mockDataSource to TaskService
    taskService = new TaskService(mockDataSource as DataSource);

    jest.clearAllMocks();
  });

  it("should create and save a new task with all fields", async () => {
    // Arrange
    const id = 1;
    const dueDate = new Date();
    const mockTaskData = {
      title: "Test Task",
      description: "Test description with due date",
      status: "Todo",
      dueDate,
    } as CreateTask;
    const createdTask = { id, ...mockTaskData } as Task;

    mockTaskRepository.create.mockReturnValue(mockTaskData);
    mockTaskRepository.save.mockResolvedValue(createdTask);

    // Act
    const result = await taskService.createTask(mockTaskData);

    // Assert
    expect(mockTaskRepository.create).toHaveBeenCalledWith(mockTaskData);
    expect(mockTaskRepository.save).toHaveBeenCalledWith(mockTaskData);
    expect(result).toEqual(createdTask);
  });

  it("should create and save a new task without description or due date", async () => {
    // Arrange
    const mockTaskData = { title: "Simple Task", status: "Todo" } as CreateTask;
    const createdTask = { id: 2, ...mockTaskData } as Task;

    mockTaskRepository.create.mockReturnValue(mockTaskData);
    mockTaskRepository.save.mockResolvedValue(createdTask);

    // Act
    const result = await taskService.createTask(mockTaskData);

    // Assert
    expect(mockTaskRepository.create).toHaveBeenCalledWith(mockTaskData);
    expect(mockTaskRepository.save).toHaveBeenCalledWith(mockTaskData);
    expect(result).toEqual(createdTask);
  });

  it("should retrieve all tasks with full data", async () => {
    // Arrange
    const mockTasks = [
      { id: 1, title: "Task 1", description: "Desc 1", status: "Todo", dueDate: new Date() },
      { id: 2, title: "Task 2", description: null, status: "InProgress", dueDate: null },
    ] as Task[];

    mockTaskRepository.find.mockResolvedValue(mockTasks);

    // Act
    const result = await taskService.getAllTasks();

    // Assert
    expect(mockTaskRepository.find).toHaveBeenCalledWith({ order: { id: "ASC" } });
    expect(result).toEqual(mockTasks);
  });

  it("should retrieve a single task by its ID with all fields", async () => {
    // Arrange
    const mockTask = {
      id: 1,
      title: "Task 1",
      description: "Sample description",
      status: "Todo",
      dueDate: new Date(),
    } as Task;
    mockTaskRepository.findOneBy.mockResolvedValue(mockTask);

    // Act
    const result = await taskService.getTaskById(1);

    // Assert
    expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(mockTask);
  });

  it("should update an existing task and return the merged object", async () => {
    // Arrange
    const existingTask = { id: 1, title: "Old Title", description: "Old Desc", status: "Todo" } as Task;
    const updateData = { title: "New Title", status: "Done", dueDate: new Date() };
    const mergedTask = { ...existingTask, ...updateData } as Task;

    mockTaskRepository.findOneBy.mockResolvedValue(existingTask);
    mockTaskRepository.merge.mockReturnValue(mergedTask);
    mockTaskRepository.save.mockResolvedValue(mergedTask);

    // Act
    const result = await taskService.updateTask(1, updateData);

    // Assert
    expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockTaskRepository.merge).toHaveBeenCalledWith(existingTask, updateData);
    expect(mockTaskRepository.save).toHaveBeenCalledWith(mergedTask);
    expect(result).toEqual(mergedTask);
  });

  it("should delete an existing task and return the deleted object", async () => {
    // Arrange
    const taskToDelete = {
      id: 1,
      title: "Task to delete",
      description: "This will be gone",
      status: "Todo",
      dueDate: new Date(),
    } as Task;
    mockTaskRepository.findOneBy.mockResolvedValue(taskToDelete);
    mockTaskRepository.remove.mockResolvedValue(taskToDelete);

    // Act
    const result = await taskService.deleteTask(1);

    // Assert
    expect(mockTaskRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockTaskRepository.remove).toHaveBeenCalledWith(taskToDelete);
    expect(result).toEqual(taskToDelete);
  });
});
