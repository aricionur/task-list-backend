import "reflect-metadata";
import { AppDataSource } from "./dataSource";

export async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log("✅ TypeORM data source initialized successfully!");
  } catch (error) {
    console.error("❌ TypeORM data source initialization failed:", error);
    process.exit(1); // Exit if the database connection fails
  }
}
