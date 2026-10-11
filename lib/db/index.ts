import "server-only"

import { attachDatabasePool } from "@vercel/functions"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

import * as schema from "./schema"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

// Pooled (-pooler) connection for app traffic. On Vercel Fluid compute,
// attachDatabasePool closes idle clients before the instance suspends;
// elsewhere it is a no-op.
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
attachDatabasePool(pool)

export const db = drizzle({ client: pool, schema, casing: "snake_case" })
