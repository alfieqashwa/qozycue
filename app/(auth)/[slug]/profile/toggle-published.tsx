"use client"

import { Switch } from "@/components/ui/switch"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
// import { api, type RouterOutputs } from "@/trpc/react"

export const TogglePublished = ({
  companyId,
  companyName,
  isPublished,
  countAllBooking,
}: {
  companyId: string
  companyName: string
  isPublished: boolean
  countAllBooking: RouterOutputs["order"]["countAllBooking"]
}) => {
  const utils = api.useUtils()
  const { toast } = useToast()
  const { mutate, isPending } = api.company.toggleIsPublishedAdmin.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: (
          <p className="capitalize">
            {isPublished ? "unpublished" : "published"}{" "}
            <span className="text-primary">{companyName}</span>
          </p>
        ),
      })
      await utils.user.find.invalidate()
    },
    onError(err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err.message || "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    },
  })

  return (
    <Switch
      disabled={!!countAllBooking || isPending}
      checked={isPublished}
      onCheckedChange={() =>
        mutate({
          companyId,
          isPublished: !isPublished,
        })
      }
    />
  )
}
