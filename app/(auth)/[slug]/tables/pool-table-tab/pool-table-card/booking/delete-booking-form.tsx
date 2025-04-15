"use client"

import { useMediaQuery } from "@/app/hooks/use-media-query"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2, Trash } from "lucide-react"
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

  if (isDesktop) {
    return (
      <DeleteDialog
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
      </DeleteDialog>
    )
  }
  return (
    <DeleteDrawer
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
    </DeleteDrawer>
  )
}

function DeleteDialog({
  customerName,
  open,
  setOpen,
  children,
}: {
  customerName: string
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "destructive", size: "sm" }),
          "flex w-full items-center disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Trash size={16} />
        <span>Delete</span>
      </DialogTrigger>

      <DialogContent className="bg-card pb-16">
        <DialogHeader className="pb-6">
          <DialogTitle>Are You Sure?</DialogTitle>
          <DialogDescription>
            Click Delete Booking to delete
            <span className="text-primary px-1.5 font-medium uppercase">
              {customerName}
            </span>
            &apos;s booking.
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 pt-4 md:absolute md:right-4 md:bottom-4 md:px-0 md:pt-0">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DeleteDrawer({
  customerName,
  open,
  setOpen,
  children,
}: {
  customerName: string
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="flex w-full items-center disabled:pointer-events-auto disabled:cursor-not-allowed">
        <Trash className="text-muted-foreground group-hover:text-primary size-4" />
        <span>Delete</span>
      </DrawerTrigger>

      <DrawerContent className="bg-card px-4 pb-4">
        <DrawerHeader className="pb-6">
          <DrawerTitle>Are You Sure?</DrawerTitle>
          <DrawerDescription>
            Click Delete Booking to delete
            <span className="text-primary px-1.5 font-medium uppercase">
              {customerName}
            </span>
            &apos;s booking.
          </DrawerDescription>
        </DrawerHeader>
        {children}
        <DialogFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DialogFooter>
      </DrawerContent>
    </Drawer>
  )
}
