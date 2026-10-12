"use client"

import Image from "next/image"
import { useState } from "react"

import { ChatComposer } from "@/components/chat-composer"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

type MockMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

// Placeholder conversation until real messages are wired up.
const messages: MockMessage[] = [
  {
    id: "1",
    role: "user",
    content: "Make me a voxel survival game set on a floating island.",
  },
  {
    id: "2",
    role: "assistant",
    content:
      "On it! I'll start with a small floating island made of grass, dirt and stone blocks, a first-person camera, and a day/night cycle. You'll be able to break and place blocks with the mouse.",
  },
  {
    id: "3",
    role: "user",
    content: "Nice. Can trees drop wood when I break them?",
  },
  {
    id: "4",
    role: "assistant",
    content:
      "Done. Trees are now scattered across the island, and breaking a log adds wood to your inventory. Press E to open the inventory and see what you've collected.",
  },
  {
    id: "5",
    role: "user",
    content: "Add some enemies that only come out at night.",
  },
  {
    id: "6",
    role: "assistant",
    content:
      "Added slimes that spawn on the island after sunset and hop toward you. They deal a bit of damage on contact, and a health bar now sits at the bottom of the screen. They despawn at sunrise.",
  },
  {
    id: "7",
    role: "user",
    content: "Let me craft a wooden sword to fight them.",
  },
  {
    id: "8",
    role: "assistant",
    content:
      "You can now craft a wooden sword from 2 wood and 1 stick in the inventory. With it equipped, a left click swings at enemies, and slimes take three hits to defeat.",
  },
]

export function ChatThread() {
  const [input, setInput] = useState("")

  // Temporary until the thread is wired up to /api/chat.
  function sendMessage(value: string) {
    console.log(value)
    setInput("")
  }

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
                        <MessageAvatar className="size-8 bg-transparent self-start rounded-lg">
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
                          <BubbleContent>{message.content}</BubbleContent>
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
          onSubmit={sendMessage}
        />
      </div>
    </div>
  )
}
