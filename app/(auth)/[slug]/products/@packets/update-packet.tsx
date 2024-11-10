import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { Rate, Status } from "@/types"
import { Pen } from "lucide-react"
import { useState } from "react"
import { UpdatePacketForm } from "./update-packet-form"

type UpdatePacketProps = {
  id: Id<"packets">
  name: string
  description?: string
  cost: number
  rate: Rate
  status: Status
}
export function UpdatePacket({
  id,
  name,
  description,
  cost,
  rate,
  status,
}: UpdatePacketProps) {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        disabled={status === "enabled"}
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" }),
          "flex w-full items-center disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Pen className="mr-2 h-4 w-4" />
        <span className="text-sm">Edit</span>
      </SheetTrigger>

      <SheetContent className="min-w-full bg-card sm:min-w-[480px]">
        <SheetHeader>
          <SheetTitle>Update Packet</SheetTitle>
          <SheetDescription>
            Edit Packet
            <span className="px-1.5 font-medium uppercase text-primary">
              {name}
            </span>
            . Click <b>Update Packet</b> when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <UpdatePacketForm
          id={id}
          name={name}
          description={description}
          cost={cost}
          rate={rate}
          setOpen={setOpen}
        />
      </SheetContent>
    </Sheet>
  )
}
