import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Loader2 } from "lucide-react"
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
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "Your packet has been updated.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
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

  const { data: hasPacketName } = useTanstackQuery({
    ...convexQuery(api.packets.findAll, {}),
    enabled: Boolean(id),
    select(data) {
      const filteredPacket = data.filter((packet) => packet._id !== id)
      return filteredPacket.some(
        (packet) =>
          packet.name === form.watch("name") &&
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-[200px] capitalize">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rate" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {["MINUTE", "HOUR"].map((rate, i) => (
                        <SelectItem value={rate} className="capitalize" key={i}>
                          {rate}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <SheetFooter className="mt-24 flex flex-col-reverse">
            <SheetClose
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Cancel
            </SheetClose>
            <Button disabled={hasPacketName || isPending} type="submit">
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>Please wait</span>
                </>
              ) : (
                <span>Update Packet</span>
              )}
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </ScrollArea>
  )
}
