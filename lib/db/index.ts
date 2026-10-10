import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const globalForDb = globalThis as unknown as { ledgerPool?: Pool }
export const pool = globalForDb.ledgerPool ?? new Pool({ connectionString: process.env.DATABASE_URL })
if (process.env.NODE_ENV !== 'production') globalForDb.ledgerPool = pool
export const db = drizzle(pool)
