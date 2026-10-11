"use client"

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { CoinsIcon, MessageSquareIcon, SquarePenIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Suspense, use, useState } from "react"
import { cn } from "cn"

import { Empty, EmptyDescription } from "@/components/ui/empty"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import type { Game } from "@/lib/games/queries"

export function AppSidebar({
  gamesPromise,
}: {
  gamesPromise: Promise<Game[]>
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex-row items-center justify-between">
        <SidebarMenuButton
          render={<Link href="/" />}
          className="w-auto group-data-[collapsible=icon]:hidden"
        >
          <Image
            src="/logo.svg"
            alt="Sandbox"
            width={20}
            height={20}
            className="size-5"
          />
          <span className="font-logo text-base">Sandbox</span>
        </SidebarMenuButton>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <Suspense fallback={<NewGameButton />}>
                <ActiveNewGameButton />
              </Suspense>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Recents</SidebarGroupLabel>
          <SidebarGroupContent>
            <Suspense fallback={<RecentGamesSkeleton />}>
              <GameList
                gamesPromise={gamesPromise}
                className="group-data-[collapsible=icon]:hidden"
              />
            </Suspense>
            <CollapsedRecentGames gamesPromise={gamesPromise} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <CoinsIcon />
              <span>Credits</span>
            </SidebarMenuButton>
            <SidebarMenuBadge>$1.00</SidebarMenuBadge>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center justify-between gap-2 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <OrganizationSwitcher
            appearance={{
              elements: {
                rootBox:
                  "w-full! max-w-full group-data-[collapsible=icon]:hidden!",
                organizationSwitcherTrigger:
                  "w-full! max-w-full justify-between!",
                organizationPreview: "min-w-0",
                organizationPreviewTextContainer: "min-w-0",
                organizationPreviewMainIdentifier: "truncate",
              },
            }}
          />
          <UserButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

// usePathname suspends on routes with request-time params (e.g. /games/[id]),
// so it's isolated behind Suspense to keep the rest of the layout prerendered.
function ActiveNewGameButton() {
  const pathname = usePathname()

  return <NewGameButton isActive={pathname === "/"} />
}

function NewGameButton({ isActive = false }: { isActive?: boolean }) {
  return (
    <SidebarMenuButton render={<Link href="/" />} isActive={isActive}>
      <SquarePenIcon />
      <span>New game</span>
    </SidebarMenuButton>
  )
}

function CollapsedRecentGames({
  gamesPromise,
}: {
  gamesPromise: Promise<Game[]>
}) {
  const [open, setOpen] = useState(false)

  return (
    <SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
      <SidebarMenuItem>
        <Popover open={open} onOpenChange={setOpen}>
          <SidebarMenuButton render={<PopoverTrigger />} isActive={open}>
            <MessageSquareIcon />
            <span>Recents</span>
          </SidebarMenuButton>
          <PopoverContent side="right" align="start" className="w-64 p-2">
            <PopoverHeader className="px-2 pt-1">
              <PopoverTitle className="text-xs text-muted-foreground">
                Recents
              </PopoverTitle>
            </PopoverHeader>
            <Suspense fallback={<RecentGamesSkeleton />}>
              <GameList
                gamesPromise={gamesPromise}
                onNavigate={() => setOpen(false)}
              />
            </Suspense>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function GameList({
  gamesPromise,
  onNavigate,
  className,
}: {
  gamesPromise: Promise<Game[]>
  onNavigate?: () => void
  className?: string
}) {
  const games = use(gamesPromise)
  const pathname = usePathname()

  if (games.length === 0) {
    return (
      <Empty className={cn("border p-2", className)}>
        <EmptyDescription className="text-xs">
          Your games will live here.
        </EmptyDescription>
      </Empty>
    )
  }

  return (
    <SidebarMenu className={className}>
      {games.map((game) => {
        const href = `/games/${game.id}`

        return (
          <SidebarMenuItem key={game.id}>
            <SidebarMenuButton
              render={<Link href={href} onClick={onNavigate} />}
              isActive={pathname === href}
            >
              <span>{game.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

function RecentGamesSkeleton() {
  return (
    <SidebarMenu className="group-data-[collapsible=icon]:hidden">
      {["80%", "60%", "70%"].map((width, i) => (
        <SidebarMenuItem key={i} className="flex h-8 items-center px-2">
          <Skeleton className="h-4" style={{ width }} />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
