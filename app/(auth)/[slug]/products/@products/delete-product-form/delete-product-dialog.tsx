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
import { DeleteDialogProps } from "."

export default function DeleteDialog({
  disabledBasedOnAccessLevel,
  hasSoldProduct,
  description,
  name,
  status,
  open,
  setOpen,
  children,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={
          status === "enabled" || disabledBasedOnAccessLevel || hasSoldProduct
        }
        className={cn(
          buttonVariants({ variant: "destructive" }),
          "disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Trash className="size-4" />
        <span className="text-sm">Delete</span>
      </DialogTrigger>

      <DialogContent className="bg-card pb-16">
        <DialogHeader>
          <DialogTitle>Are You Sure?</DialogTitle>
          <DialogDescription>
            {description}
            <span className="text-primary px-1.5 font-medium uppercase">
              {name}.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 pt-4 md:absolute md:right-4 md:bottom-4 md:px-0 md:pt-0">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
