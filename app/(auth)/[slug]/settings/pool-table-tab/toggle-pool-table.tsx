"use client"

import { Switch } from "@/components/ui/switch"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
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
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.pooltables.toggle),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: (
          <p>
            <span>{status === "enabled" ? "Enabled" : "Disabled"}</span>
            <span className="pl-1 font-medium uppercase text-primary">
              Table {name}
            </span>
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
    <Switch
      disabled={isActive || isPending}
      checked={status === "enabled" ? true : false}
      onCheckedChange={() =>
        mutate({
          toggleSchema: {
            id,
            status,
          },
        })
      }
    />
  )
}
