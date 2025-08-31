import { Pool } from 'pg';
import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from '../constants';

const pool = new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: Number(POSTGRES_PORT),
});

// Check the database connection
pool
  .query('SELECT 1')
  .then(() => {
    console.log('✅ Database connection successful');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });

export default pool;
