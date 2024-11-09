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
          variant="secondary"
          size="sm"
          disabled={disabledBasedOnAccessLevel}
          className="ml-2 h-8 whitespace-nowrap disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <FilePlus2 className="mr-2 h-4 w-4" />
          Create Packet
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-full bg-card sm:min-w-[480px]">
        <SheetHeader>
          <SheetTitle>Create New Packet</SheetTitle>
          <SheetDescription>
            Klik Create Packet setelah mengisi form di bawah ini.
          </SheetDescription>
        </SheetHeader>
        <CreatePacketForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  )
}
