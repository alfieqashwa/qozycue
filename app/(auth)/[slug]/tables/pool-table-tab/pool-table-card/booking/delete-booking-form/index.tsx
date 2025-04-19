"use client"

import { useMediaQuery } from "@/app/hooks/use-media-query"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { useState } from "react"
import { toast } from "sonner"
import { DeleteBookingDialog } from "./delete-booking-dialog.tsx"
import { DeleteBookingDrawer } from "./delete-booking-drawer.tsx"
import { DeleteForm } from "./delete-form.tsx"

export type DeleteBookingProps = {
  customerName: string
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
}

type DeleteBookingFormProps = {
  orderId: Id<"orders"> | null
  customerName?: string
}

export function DeleteBookingForm({
  orderId,
  customerName,
}: DeleteBookingFormProps) {
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

  if (isDesktop) {
    return (
      <DeleteBookingDialog
        customerName={customerName as string}
        open={open}
        setOpen={setOpen}
      >
        <DeleteForm isPending={isPending} handleSubmit={handleSubmit} />
      </DeleteBookingDialog>
    )
  }
  return (
    <DeleteBookingDrawer
      customerName={customerName as string}
      open={open}
      setOpen={setOpen}
    >
      <DeleteForm isPending={isPending} handleSubmit={handleSubmit} />
    </DeleteBookingDrawer>
  )
}
