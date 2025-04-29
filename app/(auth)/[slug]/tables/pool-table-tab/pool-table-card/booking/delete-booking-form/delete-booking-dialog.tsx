import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Trash } from "lucide-react"
import { DeleteBookingProps } from "."

export function DeleteBookingDialog({
  customerName,
  open,
  setOpen,
  children,
}: DeleteBookingProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "destructive", size: "sm" }))}
      >
        <Trash className="size-4" />
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
