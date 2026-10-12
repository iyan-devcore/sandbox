"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { ChatComposer } from "@/components/chat-composer"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

export function ChatThread({
  gameId,
  initialMessages,
}: {
  gameId: string
  initialMessages: UIMessage[]
}) {
  const [input, setInput] = useState("")
  const { messages, sendMessage, regenerate, status } = useChat({
    id: gameId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      // The server loads the saved thread, so only send the new message.
      // A regenerate sends none, so the server replies to the saved thread.
      prepareSendMessagesRequest({ messages, id, trigger }) {
        return trigger === "submit-message"
          ? { body: { id, message: messages.at(-1) } }
          : { body: { id } }
      },
    }),
  })

  // createGame saves the prompt as the first message, so a thread ending in a
  // user message still needs its reply. The ref stops Strict Mode's second
  // effect run from requesting it twice.
  const requestedReply = useRef(false)
  useEffect(() => {
    if (requestedReply.current) return
    requestedReply.current = true
    if (initialMessages.at(-1)?.role === "user") regenerate()
  }, [initialMessages, regenerate])

  return (
    <div className="flex h-svh flex-col">
      <MessageScrollerProvider>
        <MessageScroller className="flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="mx-auto w-full max-w-2xl p-4">
              {messages.map((message) => {
                const isUser = message.role === "user"

                return (
                  <MessageScrollerItem key={message.id} messageId={message.id}>
                    <Message align={isUser ? "end" : "start"}>
                      {!isUser && (
                        <MessageAvatar className="size-8 self-start rounded-lg bg-transparent">
                          <Image
                            src="/logo.svg"
                            alt="Assistant"
                            width={32}
                            height={32}
                          />
                        </MessageAvatar>
                      )}
                      <MessageContent>
                        <Bubble
                          variant={isUser ? "secondary" : "ghost"}
                          align={isUser ? "end" : "start"}
                        >
                          <BubbleContent>
                            {message.parts.map((part, i) =>
                              part.type === "text" ? (
                                <span key={i} className="whitespace-pre-wrap">
                                  {part.text}
                                </span>
                              ) : null
                            )}
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                )
              })}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
      <div className="mx-auto w-full max-w-2xl p-4 pt-0">
        <ChatComposer
          value={input}
          onValueChange={setInput}
          pending={status === "submitted" || status === "streaming"}
          placeholder="Describe a change to your game..."
          onSubmit={(text) => {
            sendMessage({ text })
            setInput("")
          }}
        />
      </div>
    </div>
  )
}
