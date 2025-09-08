import { DataSource } from "typeorm";
import { Task } from "../src/entity/Task";

export const testDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  synchronize: true,
  entities: [Task],
  logging: false,
});

export async function initializeTestDatabase() {
  if (!testDataSource.isInitialized) {
    await testDataSource.initialize();
  }
  return testDataSource;
}
