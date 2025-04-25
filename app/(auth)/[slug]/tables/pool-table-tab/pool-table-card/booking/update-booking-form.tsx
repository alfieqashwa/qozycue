import { useMediaQuery } from "@/app/hooks/use-media-query"
import { TimePicker } from "@/components/time-picker"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { formattedPrice } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { type TBooking, bookingSchema } from "@/types/schema/order-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { format, isBefore, isToday, isValid, set } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { BookingDialogFooter, BookingDrawerFooter } from "./update-booking"

export function UpdateBookingForm({
  orderId,
  poolTableId,
  poolTableName,
  gapDuration,
  packetId,
  startTime,
  duration,
  totalCost,
  customerName,
  customerPhone,
  setOpen,
}: {
  orderId: Id<"orders">
  poolTableId: Id<"poolTables">
  poolTableName: string
  gapDuration: number
  packetId: Id<"packets">
  startTime: number
  duration: number
  totalCost: number
  customerName?: string
  customerPhone?: string | null
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60_000)
    return () => clearInterval(timer)
  }, [])

  const form = useForm<TBooking>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      gapDuration,
      orderId,
      poolTableId,
      startTime,
      customerName: customerName ?? "anonymous",
      customerPhone: customerPhone ?? "",
      packetId,
      duration,
      cost: totalCost,
    },
  })

  const formatTimeForDisplay = (date: number | null) => {
    if (!date || !isValid(date)) return "Pick a time"
    return format(date, "PPP 'jam' HH:mm", { locale: id })
  }

  const customerNameWatch = form.watch("customerName")
  const customerPhoneWatch = form.watch("customerPhone")
  const startTimeWatch = form.watch("startTime")
  const packetIdWatch = form.watch("packetId")
  const durationWatch = form.watch("duration")

  const packets = useTanstackQuery({
    ...convexQuery(api.packets.findAll, {}),
    select(data) {
      return data
        .filter((d) => d.status === "enabled" && d.rate === "HOUR")
        .sort((a, b) => b.cost - a.cost)
        .sort((p, q) =>
          p.rate.localeCompare(q.rate, undefined, { numeric: true }),
        )
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.poolRentals.updateBooking),
    onSuccess: () => {
      setOpen(false)
      toast.success("Succeed!", {
        description: `Booking Table ${poolTableName} has been updated.`,
      })
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  function onSubmit(values: TBooking) {
    const { startTime, packetId, duration, customerName, customerPhone } =
      values

    if (packets.status !== "success" && packetId === "") return
    const costCalc = packets.data?.find((p) => p._id === packetId)
      ?.cost as number

    mutate({
      bookingSchema: {
        gapDuration,
        orderId,
        poolTableId,
        startTime,
        packetId,
        duration,
        customerName: customerName.toLowerCase(),
        customerPhone: customerPhone.trim(),
        cost: costCalc,
      },
    })
  }

  const isDesktop = useMediaQuery("(min-width: 768px)")
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="max 25 chars"
                  className="w-[280px] capitalize"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {customerNameWatch && (
          <FormField
            control={form.control}
            name="customerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="max 12 chars"
                    className="w-[280px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {/* //? SOURCE -> https://v0.dev/chat/zQaq5Yg */}
        {customerPhoneWatch && (
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Time</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] items-center justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4 opacity-50" />
                        {field.value ? (
                          <span>{formatTimeForDisplay(field.value)}</span>
                        ) : (
                          <span>Pick a time</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-4" align="start">
                    <div className="space-y-2">
                      <FormLabel>Select Time</FormLabel>
                      <TimePicker
                        date={new Date(field.value || currentTime)} // Pass a valid Date object
                        setDate={(date) => {
                          const now = new Date() // Get the current time
                          const selectedDate = date ?? now // Fallback to now if no date is provided

                          // Ensure time is valid: if today and time is in the past, adjust to current time
                          if (
                            isToday(selectedDate) &&
                            isBefore(selectedDate, now)
                          ) {
                            const adjustedDate = set(selectedDate, {
                              hours: now.getHours(),
                              minutes: now.getMinutes(),
                            })
                            field.onChange(adjustedDate.getTime())
                          } else {
                            field.onChange(selectedDate.getTime())
                          }
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {startTimeWatch && (
          <FormField
            control={form.control}
            name="packetId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Packet{" "}
                  <span className="text-muted-foreground text-xs">
                    (Hourly Only)
                  </span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-[200px] capitalize">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Packet" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {packets.status === "success" &&
                      packets.data?.map((p) => (
                        <SelectItem
                          value={p._id}
                          className="capitalize"
                          key={p._id}
                        >
                          {p.name}
                          <span className="pl-2 text-xs text-sky-400">
                            (
                            {p.cost < 1
                              ? "free"
                              : formattedPrice.format(p.cost)}
                            )
                          </span>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {packetIdWatch && (
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl className="w-[200px]">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: 6 }, (_, i) => 1 + i).map((i, _) => (
                      <SelectItem value={i.toString()} key={i}>
                        {i}
                        <span className="ml-1.5 text-sky-400">
                          {i <= 1 ? "hour" : "hours"}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {isDesktop ? (
          <BookingDialogFooter
            isPending={isPending}
            packetIdWatch={packetIdWatch}
            durationWatch={durationWatch}
          />
        ) : (
          <BookingDrawerFooter
            isPending={isPending}
            packetIdWatch={packetIdWatch}
            durationWatch={durationWatch}
          />
        )}
      </form>
    </Form>
  )
}
