"use client"

import { Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export function RemoveOrder({
  isCashier,
  orderId,
  customerName,
}: {
  isCashier: boolean
  orderId: string
  customerName: string
}) {
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const utils = api.useUtils()
  const { toast } = useToast()

  const { mutate, isPending } = api.order.remove.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: `${customerName} has been successfully removed.`,
      })
      await utils.order.invalidate()
      await wait().then(() => setOpen(false))
      router.refresh()
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    mutate({ id: orderId })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={!isCashier}
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "flex items-center disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        <span>Remove</span>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              You can&apos;t undo this changes. Click Remove when you&apos;re
              sure to remove
              <span className="px-1.5 font-medium uppercase text-primary">
                {customerName}.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-4">
            <DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
              Cancel
            </DialogClose>
            {isPending ? (
              <Button
                disabled
                variant="destructive"
                size="sm"
                className="disabled:pointer-events-auto disabled:cursor-not-allowed"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
