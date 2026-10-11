import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { listGames } from "@/lib/games/queries"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <AppSidebar gamesPromise={listGames()} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
