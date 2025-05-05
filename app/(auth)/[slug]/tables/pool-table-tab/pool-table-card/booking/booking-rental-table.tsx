"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { formattedPriceBasedOnCountryCode } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { FunctionReturnType } from "convex/server"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { AlarmClockOff, Hash, UserRoundCheck } from "lucide-react"
import { DeleteBookingForm } from "./delete-booking-form"
import { StartAutomatically } from "./start-booking-automatically"
import { UpdateBooking } from "./update-booking"

export function BookingRentalTable({
  bookingList,
  poolTableId,
  poolTableName,
  gapDuration,
  orderId,
  stopCount,
  hours,
  minutes,
  seconds,
  locale,
  currency,
}: {
  bookingList: FunctionReturnType<
    typeof api.poolRentals.findAllBookingByPoolTableId
  >
  poolTableId: Id<"poolTables">
  poolTableName: string
  gapDuration: number
  orderId: Id<"orders"> | undefined
  stopCount: boolean
  hours: number | null
  minutes: number | null
  seconds: number | null
  locale: string
  currency: string
}) {
  return (
    <div className="px-2">
      <Table>
        <TableCaption>List of booking orders</TableCaption>
        <TableHeader>
          <TableRow className="text-xs tracking-wider capitalize">
            {[
              "ID",
              "Cust.Name",
              "Cust.Phone",
              "Packet",
              "Cost",
              "Duration",
              "Total Cost",
              "Timer",
              "Start",
              "End",
              "Date Start",
              "Date End",
            ].map((title, i) => (
              <TableHead className="font-semibold" key={i}>
                {title}
              </TableHead>
            ))}
            <TableHead className="sr-only">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookingList.map((booking) => (
            <TableRow key={booking._id}>
              <TableCell>
                <Badge variant="secondary" className="px-3 py-1.5">
                  <Hash className="text-muted-foreground mr-2 h-4 w-4" />
                  <span className="max-w-[300px] truncate">
                    {booking.order.id?.slice(-8, booking.order.id.length)}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="px-3 py-1.5">
                  <UserRoundCheck className="text-primary mr-2 h-4 w-4" />
                  <span className="whitespace-nowrap capitalize">
                    {booking.order.customer.name}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="px-3 py-1.5">
                  <UserRoundCheck className="text-primary mr-2 h-4 w-4" />
                  <span className="whitespace-nowrap capitalize">
                    {booking.order?.customer?.phone}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="px-3 py-1.5">
                  <span
                    className={cn(
                      "max-w-[500px] truncate capitalize",
                      booking.packet?.rate === "HOUR"
                        ? "text-sky-400"
                        : "text-amber-300",
                    )}
                  >
                    {booking.packet?.name}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="px-3 py-1.5">
                  <span className="max-w-[500px] truncate capitalize">
                    {formattedPriceBasedOnCountryCode(
                      locale,
                      currency,
                      Number(booking.packet?.cost),
                    )}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="px-3 py-1.5">
                  <span
                    className={cn(
                      "max-w-[500px] truncate",
                      booking.packet?.rate === "HOUR"
                        ? "text-sky-400"
                        : "text-amber-300",
                    )}
                  >
                    {booking.duration}{" "}
                    {booking.packet?.rate === "HOUR" ? "hr" : "min"}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="px-3 py-1.5">
                  <span className="max-w-[500px] truncate capitalize">
                    {formattedPriceBasedOnCountryCode(
                      locale,
                      currency,
                      Number(booking.totalCost),
                    )}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                {orderId === booking.order?.id ? (
                  <StartAutomatically
                    stopCount={stopCount}
                    hours={hours}
                    minutes={minutes}
                    seconds={seconds}
                  />
                ) : (
                  <Badge
                    variant="secondary"
                    className="text-muted-foreground w-28 py-1"
                  >
                    <AlarmClockOff size={18} className="mr-2" />
                    <span>-- : -- : --</span>
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="whitespace-nowrap text-sky-400">
                  {booking.timeStart
                    ? format(booking.timeStart, "pp", { locale: id })
                    : "-"}
                </div>
              </TableCell>
              <TableCell>
                <div className="whitespace-nowrap text-sky-400">
                  {booking.timeEnd
                    ? format(booking.timeEnd, "pp", { locale: id })
                    : "-"}
                </div>
              </TableCell>
              <TableCell>
                <div className="whitespace-nowrap">
                  {format(booking.timeStart as number, "PP", { locale: id })}
                </div>
              </TableCell>
              <TableCell>
                <div className="whitespace-nowrap">
                  {format(booking.timeEnd as number, "PP", { locale: id })}
                </div>
              </TableCell>
              <TableCell className="w-[100px] font-medium capitalize">
                <UpdateBooking
                  orderId={booking.order?.id!}
                  poolTableId={poolTableId}
                  poolTableName={poolTableName}
                  gapDuration={gapDuration}
                  packetId={booking.packet?._id!}
                  startTime={booking.timeStart}
                  duration={booking.duration!}
                  totalCost={booking.totalCost!}
                  customerName={booking.order?.customer?.name}
                  customerPhone={booking.order?.customer?.phone}
                  locale={locale}
                />
              </TableCell>
              <TableCell className="w-[100px] font-medium capitalize">
                <DeleteBookingForm
                  orderId={booking.order?.id as Id<"orders">}
                  customerName={booking.order?.customer?.name}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
