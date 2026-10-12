"use client"

import { ArrowUpIcon, ChevronDownIcon, GripHorizontalIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"

type ChatComposerProps = {
  value: string
  onValueChange: (value: string) => void
  onSubmit: (value: string) => void
  pending?: boolean
  placeholder?: string
}

export function ChatComposer({
  value,
  onValueChange,
  onSubmit,
  pending = false,
  placeholder = "Describe the game you want to build...",
}: ChatComposerProps) {
  return (
    <form
      className="w-full"
      onSubmit={(e) => {
        e.preventDefault()
        const trimmed = value.trim()
        if (trimmed && !pending) onSubmit(trimmed)
      }}
    >
      <InputGroup className="rounded-xl">
        <InputGroupTextarea
          name="prompt"
          required
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              e.currentTarget.form?.requestSubmit()
            }
          }}
        />
        <InputGroupAddon align="block-end">
          <DropdownMenu>
            <DropdownMenuTrigger render={<InputGroupButton />}>
              <GripHorizontalIcon />
              Kimi K3
              <ChevronDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto">
              <DropdownMenuItem>Kimi K3</DropdownMenuItem>
              <DropdownMenuItem>Claude Sonnet 5.5</DropdownMenuItem>
              <DropdownMenuItem>Claude Opus 5.5</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <InputGroupButton
            type="submit"
            variant="default"
            size="icon-sm"
            aria-label="Send"
            disabled={pending}
            className="ml-auto rounded-full"
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
