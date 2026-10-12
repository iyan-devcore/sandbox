"use client"

import { useState, useTransition } from "react"

import { ChatComposer } from "@/components/chat-composer"
import { createGame } from "@/lib/games/actions"

export function NewGameComposer() {
  const [value, setValue] = useState("")
  const [pending, startTransition] = useTransition()

  return (
    <ChatComposer
      value={value}
      onValueChange={setValue}
      pending={pending}
      onSubmit={(prompt) =>
        startTransition(async () => {
          await createGame(prompt)
          setValue("")
        })
      }
    />
  )
}
