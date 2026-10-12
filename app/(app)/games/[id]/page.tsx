import { notFound } from "next/navigation"

import { ChatThread } from "@/components/chat-thread"
import { getGame, getGameMessages } from "@/lib/games/queries"

// Reads the session to scope the game to the org, so block on the server.
export const instant = false

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [game, messages] = await Promise.all([getGame(id), getGameMessages(id)])
  if (!game || !messages) notFound()

  return <ChatThread gameId={game.id} initialMessages={messages} />
}
