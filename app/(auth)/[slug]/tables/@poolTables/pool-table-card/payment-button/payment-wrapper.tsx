import { Banknote } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"

type Props = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  disabled?: boolean
  poolTableName: string
  children: React.ReactNode
}

export const PaymentSheet = ({
  open,
  setOpen,
  disabled,
  poolTableName,
  children,
}: Props) => (
  <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger asChild>
      <Button
        disabled={disabled}
        variant="secondary"
        className="space-x-2 disabled:pointer-events-auto disabled:cursor-not-allowed"
      >
        <Banknote size={20} />
        <span className="text-sm">Payment</span>
      </Button>
    </SheetTrigger>

    <SheetContent className="h-svh min-w-full bg-card sm:min-w-[480px]">
      <SheetHeader>
        <SheetTitle className="whitespace-nowrap">
          Table {poolTableName}
        </SheetTitle>
        <SheetDescription>Proceed to calculate payment</SheetDescription>
      </SheetHeader>
      {children}
    </SheetContent>
  </Sheet>
)

export const PaymentDrawer = ({
  open,
  setOpen,
  disabled,
  poolTableName,
  children,
}: Props) => (
  <Drawer open={open} onOpenChange={setOpen}>
    <DrawerTrigger asChild>
      <Button
        disabled={disabled}
        variant="secondary"
        className="space-x-2 disabled:pointer-events-auto disabled:cursor-not-allowed"
      >
        <Banknote size={20} />
        <span className="text-sm">Payment</span>
      </Button>
    </DrawerTrigger>

    <DrawerContent className="bg-card px-6 sm:min-w-[480px]">
      <DrawerHeader>
        <DrawerTitle className="whitespace-nowrap">
          Table {poolTableName}
        </DrawerTitle>
        <DrawerDescription>Proceed to calculate payment</DrawerDescription>
      </DrawerHeader>
      {children}
    </DrawerContent>
  </Drawer>
)
