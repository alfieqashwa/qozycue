import { FilePlus2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CreatePacketForm } from "./create-packet-form"

export function CreatePacket({
  disabledBasedOnAccessLevel,
}: {
  disabledBasedOnAccessLevel: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          disabled={disabledBasedOnAccessLevel}
          className="whitespace-nowrap disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <FilePlus2 className="size-4" />
          Create Packet
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-card min-w-full px-6 pt-4 sm:min-w-[480px]">
        <SheetHeader>
          <SheetTitle>Create New Packet</SheetTitle>
          <SheetDescription>
            Click <b>Create Packet</b> when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <CreatePacketForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  )
}
