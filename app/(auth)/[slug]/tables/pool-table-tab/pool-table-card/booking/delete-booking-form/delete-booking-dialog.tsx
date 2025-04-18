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

export default function DeleteBookingDialog({
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
