"use server"

import { auth } from "@clerk/nextjs/server"
import { generateId, generateText } from "ai"
import { updateTag } from "next/cache"
import { redirect } from "next/navigation"

import { model } from "@/lib/ai"
import { db } from "@/lib/db"
import { games } from "@/lib/db/schema"
import { gamesTag } from "@/lib/games/queries"

const MAX_TITLE_LENGTH = 100

export async function createGame(input: string) {
  const { orgId } = await auth.protect()
  if (!orgId) {
    throw new Error("Select an organization before creating a game")
  }

  const prompt = input.trim()
  if (!prompt) {
    throw new Error("Describe the game you want to build")
  }

  const title = await generateTitle(prompt)

  // The prompt becomes the first chat message; the game page asks for its reply.
  const [game] = await db
    .insert(games)
    .values({
      orgId,
      title,
      messages: [
        {
          id: generateId(),
          role: "user",
          parts: [{ type: "text", text: prompt }],
        },
      ],
    })
    .returning({ id: games.id })

  updateTag(gamesTag(orgId))

  redirect(`/games/${game.id}`)
}

// Not exported: every export of a "use server" file is a callable endpoint.
async function generateTitle(prompt: string) {
  try {
    const { text } = await generateText({
      model,
      // Thinking adds seconds of latency and isn't needed for a short title.
      reasoning: "none",
      instructions:
        "Write a short, catchy title (2-6 words) for the game the user " +
        "describes. Reply with the title only, without quotes.",
      prompt,
    })

    const title = text.trim().replace(/^["']|["']$/g, "")
    if (title) return title.slice(0, MAX_TITLE_LENGTH)
  } catch (error) {
    // Creating the game matters more than its title, e.g. if Ollama is down.
    console.error("Failed to generate game title", error)
  }

  return prompt.slice(0, MAX_TITLE_LENGTH)
}
