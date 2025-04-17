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
import { Status } from "@/types"
import { Trash } from "lucide-react"

export default function DeleteDrawer({
  disabledBasedOnAccessLevel,
  hasProductId,
  name,
  status,
  open,
  setOpen,
  children,
}: {
  disabledBasedOnAccessLevel: boolean
  hasProductId: boolean
  name: string
  status: Status
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
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
      </DrawerTrigger>

      <DrawerContent className="bg-card px-4 pb-4 text-center">
        <DrawerHeader>
          <DrawerTitle>Are You Sure?</DrawerTitle>
          <DrawerDescription>
            You can&apos;t undo this changes. Click Delete Product when
            you&apos;re sure to delete
            <span className="text-primary px-1.5 font-medium uppercase">
              {name}.
            </span>
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
