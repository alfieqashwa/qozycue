import { Button } from "@/components/ui/button"
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
import { Trash } from "lucide-react"

export default function DeleteBookingDrawer({
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
