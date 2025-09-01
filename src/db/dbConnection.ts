import pool from "./pool";

export async function checkDatabaseConnection(): Promise<void> {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connection successful");
  } catch (err: any) {
    console.error("❌ Database connection failed:", err.message);
  }
}
