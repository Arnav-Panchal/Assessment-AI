// lib/db.ts
import { Pool } from "@neondatabase/serverless";

declare global {
  // eslint-disable-next-line no-var
  var __neonPool: Pool | undefined;
}

export const pool = globalThis.__neonPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
});

if (!globalThis.__neonPool) {
  globalThis.__neonPool = pool;
}

export async function query(sql: string, params?: any[]) {
  return pool.query(sql, params);
}