import { zodResolver } from "@hookform/resolvers/zod"
import { Rate } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { SheetFooter } from "~/components/ui/sheet"
import { ToastAction } from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"
import { api } from "~/trpc/react"
import { packetSchema, type TPacket } from "~/types/schema/packet-schema"

export function UpdatePacketForm({
  packet,
  setOpen,
}: {
  packet: TPacket
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { id, name, description, cost, rate } = packet

  const router = useRouter()
  const { toast } = useToast()

  const { mutate, isPending } = api.packet.update.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your packet has been updated.",
      })
      router.refresh()
      /* auto-closed after succeed submit the dialog form */
      setOpen(false)
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

  // 1. Define form.
  const form = useForm<TPacket>({
    resolver: zodResolver(packetSchema),
    defaultValues: {
      id,
      name,
      description,
      cost,
      rate,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: TPacket) {
    const { id, name, description, cost, rate } = values

    mutate({
      id,
      name: name.toLowerCase(),
      description,
      cost,
      rate,
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
                <Input placeholder="name" {...field} className="capitalize" />
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
                <Input placeholder="name" {...field} />
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
                <Input type="number" placeholder="Price" {...field} />
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
                <FormControl className="capitalize">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Rate" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={Rate.MINUTE} className="capitalize">
                      {Rate.MINUTE}
                    </SelectItem>
                    <SelectItem value={Rate.HOUR} className="capitalize">
                      {Rate.HOUR}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <SheetFooter className="absolute bottom-4 left-0 right-0 px-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="mt-1.5 sm:mt-0"
          >
            Cancel
          </Button>
          {isPending ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button disabled={isPending} type="submit">
              Update Packet
            </Button>
          )}
        </SheetFooter>
      </form>
    </Form>
  )
}
