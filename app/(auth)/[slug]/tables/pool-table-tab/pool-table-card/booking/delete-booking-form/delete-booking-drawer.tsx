import { Button, buttonVariants } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { Trash } from "lucide-react"
import { DeleteBookingProps } from "."

export function DeleteBookingDrawer({
  customerName,
  open,
  setOpen,
  children,
}: DeleteBookingProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        className={cn(buttonVariants({ variant: "destructive", size: "sm" }))}
      >
        <Trash className="size-4" />
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
