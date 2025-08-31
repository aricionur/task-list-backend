import pool from './pool';

const createTasksTableQuery = `
  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    due_date DATE
  );
`;

export async function initializeDatabase() {
  try {
    await pool.query(createTasksTableQuery);
    console.log('✅ Table "tasks" is ready.');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1); // Exit the process if table creation fails
  }
}
