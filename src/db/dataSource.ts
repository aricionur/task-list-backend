import { DataSource } from "typeorm";
import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from "../constants";
import { Task } from "../entity/Task";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  synchronize: true, // For development only!
  logging: false,
  entities: [Task],
  migrations: [],
  subscribers: [],
});
