import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Banknote } from "lucide-react"

type PaymentSheetProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  disabled?: boolean
  poolTableName?: string
  children: React.ReactNode
}

export default function PaymentSheet({
  open,
  setOpen,
  disabled,
  poolTableName,
  children,
}: PaymentSheetProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          disabled={disabled}
          variant="secondary"
          className="gap-2 disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <Banknote className="text-primary disabled:text-primary/10 size-5" />
          <span className="text-sm">Payment</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="bg-card h-svh min-w-full px-4 sm:min-w-[480px]">
        <SheetHeader>
          <SheetTitle className="whitespace-nowrap">
            {poolTableName ? `Table ${poolTableName}` : "Cafe Only"}
          </SheetTitle>
          <SheetDescription>Proceed to calculate payment</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}
