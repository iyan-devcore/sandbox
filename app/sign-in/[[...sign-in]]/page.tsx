import { SignIn } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

// Auth check redirects before streaming, so let this route block on the server.
export const instant = false

export default async function SignInPage() {
  const { userId } = await auth()
  if (userId) redirect("/")

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  )
}
