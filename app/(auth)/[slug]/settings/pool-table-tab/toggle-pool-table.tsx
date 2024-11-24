"use client"

import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { Status } from "@/types"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { toast } from "sonner"

export const TogglePoolTable = ({
  isActive,
  id,
  name,
  status,
}: {
  isActive: boolean
  id: Id<"poolTables">
  name: string
  status: Status
}) => {
  const { mutate, isPending, variables } = useMutation({
    mutationFn: useConvexMutation(api.poolTables.toggle),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: (
          <p>
            {variables?.togglePoolSchema.status !== "enabled"
              ? "Enabled"
              : "Disabled"}{" "}
            Table {name}
          </p>
        ),
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Switch
          disabled={isActive || isPending}
          checked={status === "enabled" ? true : false}
          onCheckedChange={() =>
            mutate({
              togglePoolSchema: {
                id,
                status,
              },
            })
          }
        />
      </TooltipTrigger>
      <TooltipContent
        side="left"
        className={cn(
          "bg-muted normal-case text-muted-foreground",
          isActive ? "block" : "hidden",
        )}
      >
        Table {name} is active
      </TooltipContent>
    </Tooltip>
  )
}
