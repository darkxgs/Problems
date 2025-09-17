import { sql } from './database';

export async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT 1 as test`;
    console.log('Database connection successful:', result);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}