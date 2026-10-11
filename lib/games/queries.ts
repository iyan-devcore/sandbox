import "server-only"

import { auth } from "@clerk/nextjs/server"
import { desc, eq } from "drizzle-orm"
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
