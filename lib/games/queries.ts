import "server-only"

import { auth } from "@clerk/nextjs/server"
import type { UIMessage } from "ai"
import { and, desc, eq } from "drizzle-orm"
import { cacheTag } from "next/cache"

import { db } from "@/lib/db"
import { games } from "@/lib/db/schema"

export type Game = Awaited<ReturnType<typeof listGamesByOrgId>>[number]

export function gamesTag(orgId: string) {
  return `games:${orgId}`
}

export async function listGames() {
  const { orgId } = await auth()
  if (!orgId) return []

  return listGamesByOrgId(orgId)
}

// Not exported: callers go through listGames so the orgId always comes from
// the session, never from an argument a caller could forge.
async function listGamesByOrgId(orgId: string) {
  "use cache"
  cacheTag(gamesTag(orgId))

  return db
    .select({ id: games.id, title: games.title })
    .from(games)
    .where(eq(games.orgId, orgId))
    .orderBy(desc(games.createdAt))
}

// games.id is a uuid column, so anything else would make Postgres throw.
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function getGame(id: string) {
  const { orgId } = await auth()
  if (!orgId || !UUID_PATTERN.test(id)) return null

  return getGameByOrgId(orgId, id)
}

// Not exported, for the same reason as listGamesByOrgId.
async function getGameByOrgId(orgId: string, id: string) {
  "use cache"
  cacheTag(gamesTag(orgId))

  const [game] = await db
    .select({ id: games.id, title: games.title })
    .from(games)
    .where(and(eq(games.id, id), eq(games.orgId, orgId)))

  return game ?? null
}

// Uncached on purpose: the chat route appends to this thread and saves it
// back, so it must always read the latest version.
export async function getGameMessages(id: string) {
  const { orgId } = await auth()
  if (!orgId || !UUID_PATTERN.test(id)) return null

  const [game] = await db
    .select({ messages: games.messages })
    .from(games)
    .where(and(eq(games.id, id), eq(games.orgId, orgId)))

  return game?.messages ?? null
}

// Takes orgId rather than reading the session because the chat route saves
// after the response has streamed. Callers must pass the session's orgId.
export async function saveGameMessages({
  orgId,
  id,
  messages,
}: {
  orgId: string
  id: string
  messages: UIMessage[]
}) {
  await db
    .update(games)
    .set({ messages })
    .where(and(eq(games.id, id), eq(games.orgId, orgId)))
}
