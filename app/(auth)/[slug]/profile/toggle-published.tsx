"use client"

import { Switch } from "@/components/ui/switch"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

type TogglePublishedProps = {
  companyId: Id<"companies">
  companyName: string
  isPublished: boolean
  countAllBooking: boolean
}
export function TogglePublished({
  companyId,
  companyName,
  isPublished,
  countAllBooking,
}: TogglePublishedProps) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.companies.toggleIsPublished),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: (
          <p className="capitalize">
            {isPublished ? "unpublished" : "published"}{" "}
            <span className="text-primary">{companyName}</span>
          </p>
        ),
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description: err.message || "There was a problem with your request.",
      }),
  })

  return (
    <Switch
      disabled={countAllBooking || isPending}
      checked={isPublished}
      onCheckedChange={() =>
        mutate({
          toggleIsPublishedSchema: {
            id: companyId,
            isPublished,
          },
        })
      }
    />
  )
}
