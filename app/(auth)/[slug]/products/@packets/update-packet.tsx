import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { Rate, Status } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
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

  const me = useTanstackQuery(convexQuery(api.users.me, {}))
  const managerAccessLevel =
    me.status === "success" &&
    (me.data?.role === "ZENITH" ||
      me.data?.role === "ADMIN" ||
      me.data?.role === "MANAGER")

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        disabled={status === "enabled" || !managerAccessLevel}
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "flex w-full items-center disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Pen className="size-4" />
        <span>Edit</span>
      </SheetTrigger>

      <SheetContent className="bg-card min-w-full pt-4 text-center sm:min-w-[480px] md:text-start">
        <SheetHeader>
          <SheetTitle>Update Packet</SheetTitle>
          <SheetDescription>
            Edit Packet
            <span className="text-primary px-1.5 font-medium uppercase">
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
