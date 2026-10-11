"use server"

import { auth } from "@clerk/nextjs/server"
import { updateTag } from "next/cache"

import { db } from "@/lib/db"
import { games } from "@/lib/db/schema"
import { gamesTag } from "@/lib/games/queries"

const MAX_TITLE_LENGTH = 100

export async function createGame(formData: FormData) {
  const { orgId } = await auth.protect()
  if (!orgId) {
    throw new Error("Select an organization before creating a game")
  }

  const prompt = String(formData.get("prompt") ?? "").trim()
  if (!prompt) {
    throw new Error("Describe the game you want to build")
  }

  const [game] = await db
    .insert(games)
    .values({ orgId, title: prompt.slice(0, MAX_TITLE_LENGTH) })
    .returning({ id: games.id })

  updateTag(gamesTag(orgId))

  return game
}
