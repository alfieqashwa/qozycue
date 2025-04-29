"use client"

import { buttonVariants } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { FilePlus2 } from "lucide-react"
import { useState } from "react"
import { CreateBookingForm } from "./create-booking-form"

export const CreateBooking = ({
  poolTableId,
}: {
  poolTableId: Id<"poolTables">
}) => {
  const [open, setOpen] = useState(false)

  const { data, status } = useTanstackQuery({
    ...convexQuery(api.poolTables.findGapDuration, { poolTableId }),
    enabled: Boolean(poolTableId),
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "default" }),
          "h-10 font-semibold whitespace-nowrap disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <FilePlus2 className="size-5" />
        <span className="md:text-lg">New Booking</span>
      </DialogTrigger>
      {status === "success" && (
        <CreateBookingForm
          poolTableId={poolTableId}
          gapDuration={data?.gapDuration!}
          setOpen={setOpen}
        />
      )}
    </Dialog>
  )
}
