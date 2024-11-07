"use client"

import { Status } from "@prisma/client"
import { Switch } from "~/components/ui/switch"
import { ToastAction } from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"
import { api } from "~/trpc/react"

export const TogglePoolTable = ({
  isActive,
  id,
  name,
  status,
}: {
  isActive: boolean
  id: string
  name: string
  status: Status
}) => {
  const utils = api.useUtils()
  const { toast } = useToast()

  const { mutate, isPending } = api.poolTable.toggle.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: (
          <p>
            <span>{status === Status.disabled ? "Enabled" : "Disabled"}</span>
            <span className="pl-1 font-medium uppercase text-primary">
              Table {name}
            </span>
          </p>
        ),
      })
      await utils.poolTable.findAllByCompanyId.invalidate()
      /* auto-closed after succeed submit the dialog form */
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
      disabled={isActive || isPending}
      checked={status === Status.enabled ? true : false}
      onCheckedChange={() =>
        mutate({
          id,
          status: status === Status.disabled ? "enabled" : "disabled",
        })
      }
    />
  )
}
