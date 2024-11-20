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
  description: string
  children: React.ReactNode
}

export const PaymentCafeOnlySheet = ({
  open,
  setOpen,
  disabled,
  description,
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
        <SheetTitle className="whitespace-nowrap">Cafe Only</SheetTitle>
        <SheetDescription>{description}</SheetDescription>
      </SheetHeader>
      {children}
    </SheetContent>
  </Sheet>
)

export const PaymentCafeOnlyDrawer = ({
  open,
  setOpen,
  disabled,
  description,
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

    <DrawerContent className="min-w-full bg-card px-6 sm:min-w-[480px]">
      <DrawerHeader>
        <DrawerTitle className="whitespace-nowrap">Cafe Only</DrawerTitle>
        <DrawerDescription>{description}</DrawerDescription>
      </DrawerHeader>
      {children}
    </DrawerContent>
  </Drawer>
)
