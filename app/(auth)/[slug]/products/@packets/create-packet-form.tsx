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
import { cn } from "@/lib/utils"
import {
  createPacketSchema,
  type TCreatePacket,
} from "@/types/schema/packet-schema"
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

export function CreatePacketForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.packets.create),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "Your packet has been created.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  const form = useForm<TCreatePacket>({
    resolver: zodResolver(createPacketSchema),
    defaultValues: {
      name: "",
      description: "",
      cost: 0,
      rate: "MINUTE",
    },
  })

  const { data: hasPacketName } = useTanstackQuery({
    ...convexQuery(api.packets.findAll, {}),
    select(data) {
      return data.some(
        (packet) =>
          packet.name === form.watch("name") &&
          packet.rate === form.watch("rate"),
      )
    },
  })

  function onSubmit(values: TCreatePacket) {
    const { name, description, cost, rate } = values
    mutate({
      createPacketSchema: {
        name: name.toLowerCase(),
        description: description.toLowerCase(),
        cost,
        rate,
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                  placeholder="description"
                  className="w-[200px] capitalize"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Price */}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-[200px] uppercase">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {["MINUTE", "HOUR"].map((rate, i) => (
                      <SelectItem value={rate} className="uppercase" key={i}>
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
        <SheetFooter className="absolute bottom-4 left-0 right-0 px-6">
          <SheetClose className={cn(buttonVariants({ variant: "secondary" }))}>
            Cancel
          </SheetClose>
          {isPending ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button disabled={hasPacketName} type="submit">
              Create Packet
            </Button>
          )}
        </SheetFooter>
      </form>
    </Form>
  )
}
