import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Status } from "@/types"
import { Pen } from "lucide-react"

type UpdateProductSheetProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  managerAccessLevel: boolean
  name: string
  description: string
  status: Status
  children: React.ReactNode
}

export default function UpdateProductSheet({
  open,
  setOpen,
  managerAccessLevel,
  name,
  description,
  status,
  children,
}: UpdateProductSheetProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        disabled={status === "enabled" || !managerAccessLevel}
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" }),
          "flex w-full items-center",
        )}
      >
        <Pen className="size-4" />
        <span className="text-sm">Edit</span>
      </SheetTrigger>

      <SheetContent className="bg-card min-w-full px-8 py-4 sm:min-w-[480px]">
        <SheetHeader>
          <SheetTitle>Update Product</SheetTitle>
          <SheetDescription>
            {description}
            <span className="text-primary pl-1 uppercase">{name}</span>.
          </SheetDescription>
        </SheetHeader>
        {children}
        <SheetFooter className="px-4 pt-4 md:absolute md:right-44 md:bottom-0 md:px-0 md:pt-0">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
