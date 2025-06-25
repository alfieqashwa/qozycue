"use client"

import { Switch } from "@/components/ui/switch"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { toast } from "sonner"

type ToggleCustomLossMinuteProps = {
  superAdminAccessLevel: boolean
  companyId: Id<"companies">
  companyName: string
  customLossMinute: boolean
}
export function ToggleCustomLossMinute({
  superAdminAccessLevel,
  companyId,
  companyName,
  customLossMinute,
}: ToggleCustomLossMinuteProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.companies.toggleCustomLossMinute),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: (
          <p className="capitalize">
            {!customLossMinute
              ? "Enabled Custom Loss Minute"
              : "Disabled Custom Loss Minute"}{" "}
            <span className="text-primary">{companyName}</span>
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
      disabled={!superAdminAccessLevel || isPending}
      checked={customLossMinute}
      onCheckedChange={() =>
        mutate({
          toggleCustomLossMinuteSchema: {
            id: companyId,
            customLossMinute,
          },
        })
      }
    />
  )
}
