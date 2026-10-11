import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: ".env.local", quiet: true })

if (!process.env.DATABASE_URL_UNPOOLED) {
  throw new Error("DATABASE_URL_UNPOOLED is not set in .env.local")
}

// Schema pushes use the direct (unpooled) connection; PgBouncer's transaction
// pooling breaks session-level operations that Drizzle Kit relies on.
export default defineConfig({
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL_UNPOOLED,
  },
})
