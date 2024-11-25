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
        "absolute -right-4 -top-4 h-6 w-6 animate-pulse rounded-full bg-primary/30",
        !count.data?.length && "hidden",
      )}
    >
      {count.status === "success" && (
        <p className="flex h-full w-full items-center justify-center text-xs font-bold text-primary">
          {count?.data.length}
        </p>
      )}
    </div>
  )
}
