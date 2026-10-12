import { createOpenAICompatible } from "@ai-sdk/openai-compatible"
import { auth } from "@clerk/nextjs/server"
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  generateId,
  streamText,
  toUIMessageStream,
  validateUIMessages,
} from "ai"

import { getGameMessages, saveGameMessages } from "@/lib/games/queries"

const ollama = createOpenAICompatible({
  name: "ollama",
  baseURL: "http://localhost:11434/v1",
})

export async function POST(req: Request) {
  const { isAuthenticated, orgId } = await auth()
  if (!isAuthenticated || !orgId) {
    return new Response("Unauthorized", { status: 401 })
  }

  // The client sends only the new message; the thread lives on the game.
  const { id, message }: { id: string; message: unknown } = await req.json()

  const previousMessages = await getGameMessages(id)
  if (!previousMessages) {
    return new Response("Not found", { status: 404 })
  }

  const messages = await validateUIMessages({
    messages: [...previousMessages, message],
  })

  const result = streamText({
    model: ollama("qwen3:8b"),
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
