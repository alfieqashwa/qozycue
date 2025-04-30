import { SubmitButton } from "@/components/submit-button"
import { buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SheetClose, SheetFooter } from "@/components/ui/sheet"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { Rate } from "@/types"
import { TUpdatePacket, updatePacketSchema } from "@/types/schema/packet-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function UpdatePacketForm({
  id,
  name,
  description,
  cost,
  rate,
  setOpen,
}: {
  id: Id<"packets">
  name: string
  description?: string
  cost: number
  rate: Rate
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.packets.update),
    onSuccess: () => {
      toast.success("Succeed!", {
        description: "Your packet has been updated.",
      })
      setOpen(false)
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  const form = useForm<TUpdatePacket>({
    resolver: zodResolver(updatePacketSchema),
    defaultValues: {
      id,
      name,
      description,
      cost,
      rate,
    },
  })

  const { data: hasPacketName, status } = useTanstackQuery({
    ...convexQuery(api.packets.findAll, {}),
    enabled: Boolean(id),
    select(data) {
      const filteredPacket = data.filter((packet) => packet._id !== id)
      return filteredPacket.some(
        (packet) =>
          packet.name === form.watch("name").toLowerCase() &&
          packet.rate === form.watch("rate"),
      )
    },
  })

  function onSubmit(values: TUpdatePacket) {
    const { id, name, description, cost, rate } = values
    mutate({
      updatePacketSchema: {
        id,
        name: name.toLowerCase(),
        description: description.toLowerCase(),
        cost,
        rate,
      },
    })
  }

  return (
    <ScrollArea className="h-[calc(100vh_-_7.5rem)]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-8">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name"
                    {...field}
                    className="w-[200px] capitalize"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desc</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name"
                    className="w-[200px] capitalize"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Packet Price */}
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Price"
                    className="w-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Rate */}
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
                    className="flex flex-row items-center space-x-6 pt-1 pl-1"
                  >
                    {/* check if there's customer which has already booked the pool, then a new customer cannot have MINUTE rate options. */}
                    {[
                      { value: "MINUTE", label: "MINUTE" },
                      { value: "HOUR", label: "HOURLY" },
                    ].map((rate, i) => (
                      <FormItem
                        className={cn("flex items-center")}
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
                            "cursor-pointer rounded-md border-2 px-2 py-1.5 text-xs tracking-wider opacity-50 ring-1 peer-aria-checked:opacity-100 md:text-sm",
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
          <SheetFooter className="mt-24 flex flex-col-reverse md:flex-row md:justify-end md:space-x-2">
            <SheetClose className={cn(buttonVariants({ variant: "outline" }))}>
              Cancel
            </SheetClose>
            <SubmitButton
              title="Update Packet"
              isPending={isPending}
              disabled={status === "success" && hasPacketName}
            />
          </SheetFooter>
        </form>
      </Form>
    </ScrollArea>
  )
}
