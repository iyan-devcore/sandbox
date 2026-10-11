import { Suspense } from "react"

export default function Page({ params }: PageProps<"/games/[id]">) {
  return (
    <div className="p-4">
      <Suspense>
        <GameId params={params} />
      </Suspense>
    </div>
  )
}

async function GameId({
  params,
}: {
  params: PageProps<"/games/[id]">["params"]
}) {
  const { id } = await params

  return <p>{id}</p>
}
