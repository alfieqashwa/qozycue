import { Badge } from "@/components/ui/badge"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { User } from "lucide-react"

export function ActiveUser({ id, name }: { id: Id<"users">; name?: string }) {
  const { data: sessions, status } = useTanstackQuery(
    convexQuery(api.sessions.find, {}),
  )
  const hasActiveUser = status === "success" && sessions.userId === id

  return (
    <Badge
      variant="secondary"
      className={cn(
        "px-3 py-1.5",
        hasActiveUser ? "text-amber-300" : "text-muted-foreground",
      )}
    >
      <User className="mr-2 h-4 w-4" />
      <span className="whitespace-nowrap capitalize">{name ?? "pending"}</span>
    </Badge>
  )
}
