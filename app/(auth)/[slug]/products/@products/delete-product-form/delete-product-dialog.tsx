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
import { Status } from "@/types"
import { Trash } from "lucide-react"

export default function DeleteDialog({
  disabledBasedOnAccessLevel,
  hasProductId,
  description,
  name,
  status,
  open,
  setOpen,
  children,
}: {
  disabledBasedOnAccessLevel: boolean
  hasProductId: boolean
  description: string
  name: string
  status: Status
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={
          status === "enabled" || disabledBasedOnAccessLevel || hasProductId
        }
        className={cn(
          buttonVariants({ variant: "destructive", size: "sm" }),
          "flex w-full items-center disabled:pointer-events-auto disabled:cursor-not-allowed",
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
