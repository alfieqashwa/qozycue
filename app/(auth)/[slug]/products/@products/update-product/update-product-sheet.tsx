import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
  status: Status
  children: React.ReactNode
}

export function UpdateProductSheet({
  open,
  setOpen,
  managerAccessLevel,
  name,
  status,
  children,
}: UpdateProductSheetProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        disabled={status === "enabled" || !managerAccessLevel}
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "flex w-full items-center",
        )}
      >
        <Pen className="size-4" />
        <span>Edit</span>
      </SheetTrigger>

      <SheetContent className="bg-card min-w-full px-8 py-4 sm:min-w-[480px]">
        <SheetHeader>
          <SheetTitle>Update Product</SheetTitle>
          <SheetDescription>
            Click Update Product when you&apos;re done.
            <span className="text-primary pl-1 uppercase">{name}</span>.
          </SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}
