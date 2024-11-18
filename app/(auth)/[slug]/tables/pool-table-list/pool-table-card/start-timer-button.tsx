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
import { Rate } from "@/types"
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
      rate: "MINUTE",
      cost: 0,
    },
  })

  const packetIdWatch = form.watch("packetId")
  const durationWatch = form.watch("duration")
  const isHourly =
    packets.data?.find((p) => p._id === packetIdWatch)?.rate === "HOUR"

  const handleOnCloseAutoFocus = () => {
    form.reset()
  }

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.orders.startTimer),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: `Table ${poolTableName} has been started.`,
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  // 2. Define a submit handler.
  function onSubmit(values: TStartTimer) {
    const { customerName, customerPhone, packetId, duration } = values

    if (packets.status !== "success" && packetId === "") return

    const costCalc = packets.data?.find((p) => p._id === packetId)
      ?.cost as number
    const rate = packets.data?.find((p) => p._id === packetId)?.rate as Rate

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
          className="space-x-2 disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <Timer size={20} />
          <span>Start</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={handleOnCloseAutoFocus}
        className="bg-card sm:max-w-[450px]"
      >
        <DialogHeader>
          <DialogTitle>Start Timer Table {poolTableName}</DialogTitle>
          <DialogDescription>Play with fun</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Optional"
                      className="capitalize"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>max 25 chars.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Phone</FormLabel>
                  <FormControl className="w-[200px]">
                    <Input type="number" placeholder="Optional" {...field} />
                  </FormControl>
                  <FormDescription>max 12 chars.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="packetId"
              render={({ field }) => (
                <FormItem>
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
                      countIsBooking &&
                      !!countIsBooking.data
                        ? packets.data
                            ?.filter((p) => p.rate === "HOUR")
                            .map((p) => (
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
                            ))
                        : packets.data?.map((p) => (
                            <SelectItem
                              value={p._id}
                              className="capitalize"
                              key={p._id}
                            >
                              {p.name}
                              <span
                                className={cn(
                                  "pl-2 text-xs",
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
                  <FormDescription>
                    {!!countIsBooking.data ? (
                      <span>
                        <i className="font-medium text-sky-400">Hourly</i> Only
                      </span>
                    ) : (
                      <span className="font-medium">
                        <i className="text-amber-300">Minute</i> Or{" "}
                        <i className="text-sky-400">Hourly</i>
                      </span>
                    )}
                  </FormDescription>
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
                              <span className="ml-1.5 text-sky-400">
                                {i <= 1 ? "hour" : "hours"}
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
            <DialogFooter className="pt-24 md:pt-8">
              <DialogClose
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                Cancel
              </DialogClose>
              {isPending ? (
                <Button disabled>
                  <Loader2 className="mr-2 size-4 animate-spin" />
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
