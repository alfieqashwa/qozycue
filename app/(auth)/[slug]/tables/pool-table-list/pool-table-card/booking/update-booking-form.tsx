import { useMediaQuery } from "@/app/hooks/use-media-query"
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
import { formattedPrice } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { type TBooking, bookingSchema } from "@/types/schema/pool-rental-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, isBefore, isToday, isValid, set } from "date-fns"
import { id } from "date-fns/locale"
import { Clock } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
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
  orderId: string
  poolTableId: string
  poolTableName: string
  gapDuration: number
  packetId: string
  startTime: Date
  duration: number
  totalCost: number
  customerName?: string
  customerPhone?: string | null
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60_000)
    return () => clearInterval(timer)
  }, [])

  const utils = api.useUtils()
  const { toast } = useToast()

  // 1. Define your form.
  const form = useForm<TBooking>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      gapDuration,
      orderId,
      poolTableId,
      startTime,
      customerName: customerName ?? "",
      customerPhone: customerPhone ?? "",
      packetId,
      duration,
      cost: totalCost,
    },
  })

  const formatTimeForDisplay = (date: Date | null) => {
    if (!date || !isValid(date)) return "Pick a time"
    return format(date, "PPP 'jam' HH:mm", { locale: id })
  }

  const customerNameWatch = form.watch("customerName")
  const customerPhoneWatch = form.watch("customerPhone")
  const startTimeWatch = form.watch("startTime")
  const packetIdWatch = form.watch("packetId")
  const durationWatch = form.watch("duration")

  const packets = api.packet.findAllByCompanyId.useQuery(undefined, {
    select(data) {
      return data
        .filter((d) => d.status === Status.enabled && d.rate === "HOUR")
        .sort((a, b) => b.cost - a.cost)
        .sort((p, q) =>
          p.rate.localeCompare(q.rate, undefined, { numeric: true }),
        )
    },
  })

  const { mutate, isPending } = api.poolRental.updateBooking.useMutation({
    async onSuccess() {
      await utils.poolTable.findAllByCompanyId.invalidate()
      await utils.order.findByPoolTableId.invalidate({
        poolTableId,
      })
      await utils.poolRental.findAllBookingByCompanyId.invalidate({
        poolTableId,
      })
      await utils.packet.findAllByCompanyId.invalidate()
      /* auto-closed after succeed submit the dialog form */
      // router.refresh()
      setOpen(false)
      toast({
        title: "Succeed!",
        variant: "default",
        description: <p>Booking Table {poolTableName} has been updated.</p>,
      })
    },
    onError(err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err.message || "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    },
  })

  function onSubmit(values: TBooking) {
    const { startTime, packetId, duration, customerName, customerPhone } =
      values

    if (packets.status !== "success" && packetId === "") return
    const costCalc = packets.data?.find((p) => p.id === packetId)
      ?.cost as number

    mutate({
      gapDuration,
      orderId,
      poolTableId,
      startTime,
      packetId,
      duration,
      customerName: customerName.toLowerCase(),
      customerPhone: customerPhone.trim(),
      cost: costCalc,
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
                    type="number"
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
                          "w-[280px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {formatTimeForDisplay(field.value)}
                        <Clock className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-4" align="start">
                    <div className="space-y-2">
                      <FormLabel>Select Time</FormLabel>
                      <Input
                        type="time"
                        value={field.value ? format(field.value, "HH:mm") : ""}
                        onChange={(e) => {
                          const date = field.value || new Date()
                          const [hoursStr, minutesStr] =
                            e.target.value.split(":")
                          const hours = hoursStr ? parseInt(hoursStr, 10) : 0
                          const minutes = minutesStr
                            ? parseInt(minutesStr, 10)
                            : 0
                          let newDate = set(date, {
                            hours,
                            minutes,
                          })
                          // If the selected date is today, ensure the time is not before current time
                          if (isToday(date) && isBefore(newDate, currentTime)) {
                            newDate = set(date, {
                              hours: currentTime.getHours(),
                              minutes: currentTime.getMinutes(),
                            })
                          }
                          field.onChange(newDate)
                        }}
                        className="w-full"
                        min={
                          isToday(field.value)
                            ? format(currentTime, "HH:mm")
                            : undefined
                        }
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
                  <span className="text-xs text-muted-foreground">
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
                          value={p.id}
                          className="capitalize"
                          key={p.id}
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
