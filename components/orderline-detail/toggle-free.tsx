import { Id } from "@/convex/_generated/dataModel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Switch } from "../ui/switch"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { ConvexError } from "convex/values"

type ToggleFreeProps = {
  orderlineId: Id<"orderlines">
  isFree: boolean
  icon: React.ReactNode
  orderlineStatus: string
  productName: string | undefined
  className?: string
}
export function ToggleFree({
  orderlineId,
  orderlineStatus,
  isFree,
  icon,
  productName,
  className,
}: ToggleFreeProps) {
  const [openDialog, setOpenDialog] = useState(false)

  const { mutate, isPending, variables } = useMutation({
    mutationFn: useConvexMutation(api.orderlines.toggleIsFree),
    onSuccess: () => {
      toast.success("Succeed!", {
        description: (
          <p className="capitalize">
            {productName} is {variables?.isFree ? "Free" : "Priced"}
          </p>
        ),
      })
      setOpenDialog(false)
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger>{icon}</DialogTrigger>
      <DialogContent className="flex items-center">
        <DialogHeader>
          {productName && (
            <DialogTitle className={cn("capitalize", className)}>
              {productName} is Free?
            </DialogTitle>
          )}
          <DialogDescription />
        </DialogHeader>
        <Switch
          // disabled
          checked={isFree}
          onCheckedChange={() => mutate({ orderlineId, isFree: !isFree })}
        />
      </DialogContent>
    </Dialog>
  )
}
