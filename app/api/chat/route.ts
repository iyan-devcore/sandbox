import { auth } from "@clerk/nextjs/server"
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  generateId,
  streamText,
  toUIMessageStream,
  validateUIMessages,
} from "ai"

import { model } from "@/lib/ai"
import { getGameMessages, saveGameMessages } from "@/lib/games/queries"

export async function POST(req: Request) {
  const { isAuthenticated, orgId } = await auth()
  if (!isAuthenticated || !orgId) {
    return new Response("Unauthorized", { status: 401 })
  }

  // The client sends only the new message; the thread lives on the game.
  // Without one, it's asking for a reply to the saved thread, e.g. the first
  // prompt that createGame saved.
  const { id, message }: { id: string; message?: unknown } = await req.json()

  const previousMessages = await getGameMessages(id)
  if (!previousMessages) {
    return new Response("Not found", { status: 404 })
  }
  if (!message && previousMessages.at(-1)?.role !== "user") {
    return new Response("Nothing to reply to", { status: 400 })
  }

  const messages = await validateUIMessages({
    messages: message ? [...previousMessages, message] : previousMessages,
  })

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
  })

  // Keep generating if the client disconnects, so onEnd still saves.
  result.consumeStream()

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      generateMessageId: generateId,
      onEnd: ({ messages }) => saveGameMessages({ orgId, id, messages }),
    }),
  })
}
