import { auth } from "@clerk/nextjs/server"
import Image from "next/image"

import { ChatComposer } from "@/components/chatcomposer"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { suggestions } from "@/lib/games/suggestions"

// Auth check redirects before streaming, so let this route block on the server.
export const instant = false

export default async function Page() {
  await auth.protect()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Image src="/logo.svg" alt="Logo" width={48} height={48} />
          </EmptyMedia>
          <EmptyTitle className="text-2xl">What should we build today?</EmptyTitle>
          <EmptyDescription>
            Build your own racers, shooters, puzzles and whole worlds using your
            own words. If you can describe it, you can play it.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="max-w-2xl gap-6">
          <ChatComposer />
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map(({ label, icon: Icon }) => (
              <Button key={label} variant="outline" className="rounded-full">
                <Icon data-icon="inline-start" />
                {label}
              </Button>
            ))}
          </div>
        </EmptyContent>
      </Empty>
    </div>
  )
}
