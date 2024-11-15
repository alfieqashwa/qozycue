"use client"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import { AlarmClockOff, Hash, UserRoundCheck } from "lucide-react"
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
import { formattedPriceWithRupiah } from "@/lib/format-price"
import { cn } from "@/lib/utils"
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
}: {
  bookingList: RouterOutputs["poolRental"]["findAllBookingByCompanyId"]
  poolTableId: string
  poolTableName: string
  gapDuration: number
  orderId: string | undefined
  stopCount: boolean
  hours: number | undefined
  minutes: number | undefined
  seconds: number | undefined
}) {
  return (
    <>
      <Table>
        <TableCaption>List of booking orders</TableCaption>
        <TableHeader>
          <TableRow className="text-xs capitalize tracking-wider">
            <TableHead className="font-semibold">ID</TableHead>
            <TableHead className="font-semibold">Cust. Name</TableHead>
            <TableHead className="font-semibold">Cust.Phone</TableHead>
            <TableHead className="font-semibold">Packet</TableHead>
            <TableHead className="font-semibold">Cost</TableHead>
            <TableHead className="font-semibold">Duration</TableHead>
            <TableHead className="font-semibold">Total Cost</TableHead>
            <TableHead className="font-semibold">Timer</TableHead>
            <TableHead className="font-semibold">Start</TableHead>
            <TableHead className="font-semibold">End</TableHead>
            <TableHead className="font-semibold">Date Start</TableHead>
            <TableHead className="font-semibold">Date End</TableHead>
            <TableHead className="sr-only">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookingList.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <Badge variant="secondary" className="px-3 py-1.5">
                  <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="max-w-[300px] truncate">
                    {booking.order?.id.slice(-8, booking.order.id.length)}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="px-3 py-1.5">
                  <UserRoundCheck className="mr-2 h-4 w-4 text-primary" />
                  <span className="whitespace-nowrap capitalize">
                    {booking.order?.customer?.name}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="px-3 py-1.5">
                  <UserRoundCheck className="mr-2 h-4 w-4 text-primary" />
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
                      booking.packet.rate === Rate.HOUR
                        ? "text-sky-400"
                        : "text-amber-300",
                    )}
                  >
                    {booking.packet.name}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="px-3 py-1.5">
                  <span className="max-w-[500px] truncate capitalize">
                    {formattedPriceWithRupiah.format(
                      Number(booking.packet.cost),
                    )}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="px-3 py-1.5">
                  <span
                    className={cn(
                      "max-w-[500px] truncate",
                      booking.packet.rate === Rate.HOUR
                        ? "text-sky-400"
                        : "text-amber-300",
                    )}
                  >
                    {booking.duration}{" "}
                    {booking.packet.rate === Rate.HOUR ? "hr" : "min"}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="px-3 py-1.5">
                  <span className="max-w-[500px] truncate capitalize">
                    {formattedPriceWithRupiah.format(Number(booking.totalCost))}
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
                    className="w-28 py-1 text-muted-foreground"
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
                  {format(booking.timeStart as Date, "PP", { locale: id })}
                </div>
              </TableCell>
              <TableCell>
                <div className="whitespace-nowrap">
                  {format(booking.timeEnd as Date, "PP", { locale: id })}
                </div>
              </TableCell>
              <TableCell className="w-[100px] font-medium capitalize">
                <UpdateBooking
                  orderId={booking.order?.id as string}
                  poolTableId={poolTableId}
                  poolTableName={poolTableName}
                  gapDuration={gapDuration}
                  packetId={booking.packet.id}
                  startTime={booking.timeStart as Date}
                  duration={booking.duration as number}
                  totalCost={booking.totalCost}
                  customerName={booking.order?.customer?.name}
                  customerPhone={booking.order?.customer?.phone}
                />
              </TableCell>
              <TableCell className="w-[100px] font-medium capitalize">
                <DeleteBookingForm
                  orderId={booking.order?.id as string}
                  customerName={booking.order?.customer?.name}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
