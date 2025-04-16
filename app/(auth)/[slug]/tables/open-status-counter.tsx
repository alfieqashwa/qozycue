"use client"

import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"

export const OpenStatusCounter = () => {
  const count = useTanstackQuery({
    ...convexQuery(api.orders.findAllCafeOnlyByCompanyId, {}),
  })
  return (
    <div
      className={cn(
        "bg-primary/30 absolute -top-4 -right-4 size-6 animate-pulse rounded-full",
        !count.data?.length && "hidden",
      )}
    >
      {count.status === "success" && (
        <p className="text-primary flex h-full w-full items-center justify-center text-xs font-bold">
          {count?.data.length}
        </p>
      )}
    </div>
  )
}
