"use client"

import { Switch } from "@/components/ui/switch"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { toast } from "sonner"

export function ToggleTax({
  id,
  isDefaultValue,
  hasDefaultValueTax,
}: {
  id: Id<"taxes">
  isDefaultValue: boolean
  hasDefaultValueTax: boolean
}) {
  const { mutate, isPending, variables } = useMutation({
    mutationFn: useConvexMutation(api.taxes.toggle),
    onSuccess: () => {
      toast.success("Succeed!", {
        description: `${variables?.isDefaultValue ? "Disabled" : "Enabled"}`,
      })
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  const disabledNonDefaultValueTax = hasDefaultValueTax && !isDefaultValue
  return (
    <Switch
      disabled={isPending || disabledNonDefaultValueTax}
      checked={isDefaultValue}
      onCheckedChange={() => mutate({ id, isDefaultValue })}
    />
  )
}
