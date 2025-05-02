"use client"

import { Switch } from "@/components/ui/switch"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { toast } from "sonner"

type ToggleStockableProps = {
  adminAccessLevel: boolean
  companyId: Id<"companies">
  companyName: string
  isStockable: boolean
}
export function ToggleStockable({
  adminAccessLevel,
  companyId,
  companyName,
  isStockable,
}: ToggleStockableProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.companies.toggleIsStockable),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: (
          <p className="capitalize">
            {isStockable ? "unStockable" : "stockable"}{" "}
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
      disabled={!adminAccessLevel || isPending}
      checked={isStockable}
      onCheckedChange={() =>
        mutate({
          toggleIsStockableSchema: {
            id: companyId,
            isStockable,
          },
        })
      }
    />
  )
}
