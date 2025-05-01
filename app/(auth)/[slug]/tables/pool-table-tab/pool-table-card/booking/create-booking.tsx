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
  locale,
}: {
  poolTableId: Id<"poolTables">
  locale: string
}) => {
  const [open, setOpen] = useState(false)

  const { data, status } = useTanstackQuery({
    ...convexQuery(api.poolTables.findGapDuration, { poolTableId }),
    enabled: Boolean(poolTableId),
  })

  return (
    <section className="pr-4 text-end">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "disabled:pointer-events-auto disabled:cursor-not-allowed",
          )}
        >
          <FilePlus2 />
          <span>New Booking</span>
        </DialogTrigger>
        {status === "success" && (
          <CreateBookingForm
            poolTableId={poolTableId}
            gapDuration={data?.gapDuration!}
            locale={locale}
            setOpen={setOpen}
          />
        )}
      </Dialog>
    </section>
  )
}
