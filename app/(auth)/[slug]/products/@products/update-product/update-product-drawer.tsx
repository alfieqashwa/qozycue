import { Button, buttonVariants } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { Status } from "@/types"
import { Pen } from "lucide-react"

type UpdateProductDrawerProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  managerAccessLevel: boolean
  name: string
  description: string
  status: Status
  children: React.ReactNode
}

export default function UpdateProductDrawer({
  open,
  setOpen,
  managerAccessLevel,
  name,
  description,
  status,
  children,
}: UpdateProductDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        disabled={status === "enabled" || !managerAccessLevel}
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" }),
          "flex w-full items-center",
        )}
      >
        <Pen className="mr-2 h-4 w-4" />
        <span className="text-sm">Edit</span>
      </DrawerTrigger>

      <DrawerContent className="px-8 text-center">
        <DrawerHeader>
          <DrawerTitle>Update Product</DrawerTitle>
          <DrawerDescription className="text-balance">
            {description}
            <span className="text-primary pl-1 capitalize">{name}</span>.
          </DrawerDescription>
        </DrawerHeader>
        {children}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
