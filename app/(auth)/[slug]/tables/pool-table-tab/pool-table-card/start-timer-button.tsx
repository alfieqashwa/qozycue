import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
import { startTimerSchema, type TStartTimer } from "@/types/schema/order-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2, Timer } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function StartTimerButton({
  isCashier,
  poolTableId,
  poolTableName,
  gapDuration,
}: {
  isCashier: boolean
  poolTableId: Id<"poolTables">
  poolTableName: string
  gapDuration: number
}) {
  const [open, setOpen] = useState(false)

  const countIsBooking = useTanstackQuery({
    ...convexQuery(api.poolRentals.countIsBooking, { poolTableId }),
    enabled: Boolean(poolTableId),
  })

  const packets = useTanstackQuery({
    ...convexQuery(api.packets.findAll, {}),
    select(data) {
      return data
        .filter((d) => d.status === "enabled")
        .sort((a, b) => b.cost - a.cost)
        .sort((p, q) =>
          p.rate.localeCompare(q.rate, undefined, { numeric: true }),
        )
    },
  })

  // 1. Define your form.
  const form = useForm<TStartTimer>({
    resolver: zodResolver(startTimerSchema),
    defaultValues: {
      gapDuration,
      customerName: "",
      customerPhone: "",
      poolTableId,
      packetId: "",
      duration: 0,
      rate: countIsBooking && !!countIsBooking.data ? "HOUR" : "MINUTE",
      cost: 0,
    },
  })

  const rateWatch = form.watch("rate")
  const packetIdWatch = form.watch("packetId")
  const durationWatch = form.watch("duration")
  const isHourly = rateWatch === "HOUR"

  const handleOnCloseAutoFocus = () => {
    form.reset()
  }

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.orders.startTimer),
    onSuccess: () => {
      setOpen(false)
      toast.success("Succeed!", {
        description: `Table ${poolTableName} has been started.`,
      })
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  // 2. Define a submit handler.
  function onSubmit(values: TStartTimer) {
    const { customerName, customerPhone, rate, packetId, duration } = values

    if (packets.status !== "success" && packetId === "") return

    const costCalc = packets.data?.find((p) => p._id === packetId)
      ?.cost as number

    const durationCalc = rate === "MINUTE" ? 0 : Number(duration)

    mutate({
      startTimerSchema: {
        gapDuration,
        customerName: !!customerName
          ? customerName?.toLowerCase()
          : "anonymous",
        customerPhone: customerPhone?.trim(),
        poolTableId,
        packetId,
        duration: durationCalc,
        rate,
        cost: costCalc,
      },
    })
  }

  /*
   * if there's no packetId NOR isHourly is true BUT the duration is zero,
   * then the button will be disabled
   */
  const disabled = !packetIdWatch || (!!isHourly && durationWatch === 0)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!isCashier}
          variant="secondary"
          className="disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <Timer className="text-primary disabled:text-primary/10 size-5" />
          <span>Start</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={handleOnCloseAutoFocus}
        className="bg-card"
      >
        <DialogHeader>
          <DialogTitle className="text-center">
            Start Timer Table {poolTableName}
          </DialogTitle>
          <DialogDescription className="text-center">
            Play with fun
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl className="max-w-[360px]">
                    <Input
                      placeholder="Optional"
                      className="text-sm capitalize placeholder:text-sm md:text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-center text-xs text-amber-300 italic">
                    max 25 chars.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl className="max-w-[200px]">
                    <Input
                      type="tel"
                      placeholder="Optional"
                      className="text-sm placeholder:text-sm md:text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-center text-xs text-amber-300 italic">
                    max 12 chars.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-row items-center space-x-6 pt-1"
                    >
                      {/* check if there's customer which has already booked the pool, then a new customer cannot have MINUTE rate options. */}
                      {[
                        { value: "MINUTE", label: "MINUTE" },
                        { value: "HOUR", label: "HOURLY" },
                      ].map((rate, i) => (
                        <FormItem
                          className={cn(
                            "flex items-center",
                            rate.value === "MINUTE" &&
                              !!countIsBooking.data &&
                              "hidden",
                          )}
                          key={`${rate}-${i}`}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={rate.value}
                              className="peer hidden"
                            />
                          </FormControl>
                          <FormLabel
                            className={cn(
                              "cursor-pointer rounded-md border-2 px-2 py-1.5 tracking-wider opacity-50 ring-1 peer-aria-checked:opacity-100",
                              {
                                "text-amber-300 peer-aria-checked:ring-2":
                                  rate.value === "MINUTE",
                                "text-sky-400 peer-aria-checked:ring-2":
                                  rate.value === "HOUR",
                              },
                            )}
                          >
                            {rate.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="packetId"
              render={({ field }) => (
                <FormItem className="pt-1">
                  <FormLabel>Packet</FormLabel>
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
                        packets.data
                          .filter((p) => p.rate === rateWatch)
                          .map((p) => (
                            <SelectItem
                              value={p._id}
                              className="capitalize"
                              key={p._id}
                            >
                              {p.name}
                              <span
                                className={cn(
                                  "text-xs",
                                  p.rate === "HOUR"
                                    ? "text-sky-400"
                                    : "text-amber-300",
                                )}
                              >
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
            {isHourly && (
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sky-400">Hourly</FormLabel>
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
                        {Array.from({ length: 6 }, (_, i) => 1 + i).map(
                          (i, _) => (
                            <SelectItem value={i.toString()} key={i}>
                              {i}
                              <span className="text-sky-400">
                                {i === 1 ? "hour" : "hours"}
                              </span>
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>Duration</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter className="">
              <DialogClose
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                Cancel
              </DialogClose>
              {isPending ? (
                <Button disabled>
                  <Loader2 className="size-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  disabled={disabled}
                  type="submit"
                  className="disabled:pointer-events-auto disabled:cursor-not-allowed"
                >
                  Start Timer
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
