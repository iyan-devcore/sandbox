"use client"

import {
  ArrowUpIcon,
  CarIcon,
  ChevronDownIcon,
  CrosshairIcon,
  Gamepad2Icon,
  GripHorizontalIcon,
  PickaxeIcon,
  PlaneIcon,
  SwordsIcon,
  ZapIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
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

export function ChatComposer() {
  return (
    <div className="flex w-full flex-col gap-6">
      <InputGroup className="rounded-xl">
        <InputGroupTextarea placeholder="Describe the game you want to build..." />
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
            className="ml-auto rounded-full"
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" className="rounded-full">
          <PickaxeIcon data-icon="inline-start" />
          Voxel survival
        </Button>
        <Button variant="outline" className="rounded-full">
          <SwordsIcon data-icon="inline-start" />
          Ink samurai duel
        </Button>
        <Button variant="outline" className="rounded-full">
          <ZapIcon data-icon="inline-start" />
          Comic-book firefight
        </Button>
        <Button variant="outline" className="rounded-full">
          <PlaneIcon data-icon="inline-start" />
          Realistic battlefield
        </Button>
        <Button variant="outline" className="rounded-full">
          <CrosshairIcon data-icon="inline-start" />
          Fight-first shooter
        </Button>
        <Button variant="outline" className="rounded-full">
          <CarIcon data-icon="inline-start" />
          Jungle expedition drive
        </Button>
        <Button variant="outline" className="rounded-full">
          <Gamepad2Icon data-icon="inline-start" />
          Sunny kingdom platformer
        </Button>
      </div>
    </div>
  )
}
