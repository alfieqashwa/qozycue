import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Banknote } from "lucide-react"

type PaymentDrawerProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  disabled?: boolean
  poolTableName?: string
  children: React.ReactNode
}

export default function PaymentDrawer({
  open,
  setOpen,
  disabled,
  poolTableName,
  children,
}: PaymentDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen} autoFocus={open}>
      <DrawerTrigger asChild>
        <Button
          disabled={disabled}
          variant="secondary"
          className="disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <Banknote className="text-primary disabled:text-primary/10 size-5" />
          <span className="text-sm">Payment</span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-card px-6 sm:min-w-[480px]">
        <DrawerHeader>
          <DrawerTitle className="whitespace-nowrap">
            {poolTableName ? `Table ${poolTableName}` : "Cafe Only"}
          </DrawerTitle>
          <DrawerDescription>Proceed to calculate payment</DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  )
}
