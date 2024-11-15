"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { FilePlus2 } from "lucide-react"
import { useState } from "react"
import { CreateBookingForm } from "./create-booking-form"

export const CreateBooking = ({ poolTableId }: { poolTableId: string }) => {
  const [open, setOpen] = useState(false)

  const { data, status } = api.poolTable.findGapDuration.useQuery(
    { poolTableId },
    { enabled: Boolean(poolTableId) },
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-2 h-8 whitespace-nowrap disabled:pointer-events-auto disabled:cursor-not-allowed">
          <FilePlus2 className="mr-2 h-4 w-4" />
          Booking
        </Button>
      </DialogTrigger>
      {status === "success" && (
        <CreateBookingForm
          poolTableId={poolTableId}
          gapDuration={data?.gapDuration as number}
          setOpen={setOpen}
        />
      )}
    </Dialog>
  )
}
