"use client"

import { useMediaQuery } from "@/app/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { useState } from "react"
import { toast } from "sonner"

type DeleteBookingProps = {
  orderId: Id<"orders"> | null
  customerName?: string
}

export function DeleteBookingForm({
  orderId,
  customerName,
}: DeleteBookingProps) {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.orders.remove),
    async onSuccess() {
      toast("Succeed!", {
        description: (
          <p>
            Booking{" "}
            <span className="font-medium capitalize">{customerName}</span> has
            been deleted.
          </p>
        ),
      })
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!orderId) return
    mutate({ id: orderId })
  }

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const DeleteBookingDialog = dynamic(
    () => import("./delete-booking-dialog.tsx"),
    { ssr: false },
  )
  const DeleteBookingDrawer = dynamic(
    () => import("./delete-booking-drawer.tsx"),
    { ssr: false },
  )

  if (isDesktop) {
    return (
      <DeleteBookingDialog
        customerName={customerName as string}
        open={open}
        setOpen={setOpen}
      >
        <form onSubmit={handleSubmit}>
          {isPending ? (
            <Button disabled variant="destructive">
              <Loader2 className="size-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" variant="destructive" className="f-full">
              Delete Booking
            </Button>
          )}
        </form>
      </DeleteBookingDialog>
    )
  }
  return (
    <DeleteBookingDrawer
      customerName={customerName as string}
      open={open}
      setOpen={setOpen}
    >
      <form onSubmit={handleSubmit}>
        {isPending ? (
          <Button disabled variant="destructive" className="w-full">
            <Loader2 className="size-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" variant="destructive" className="w-full">
            Delete Booking
          </Button>
        )}
      </form>
    </DeleteBookingDrawer>
  )
}
