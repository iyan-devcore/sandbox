import type { UIMessage } from "ai"
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

export const games = pgTable(
  "games",
  {
    id: uuid().primaryKey().defaultRandom(),
    // Clerk organization ID
    orgId: text().notNull(),
    title: text().notNull(),
    // Full chat thread in AI SDK UIMessage format, one thread per game
    messages: jsonb().$type<UIMessage[]>().notNull().default([]),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index().on(t.orgId)]
)
