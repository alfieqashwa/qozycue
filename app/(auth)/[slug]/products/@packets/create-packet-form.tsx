import { zodResolver } from "@hookform/resolvers/zod"
import { Rate, type Subscription } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SheetFooter } from "@/components/ui/sheet"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { validateSubscriptionLimits } from "@/lib/validate-subscription-limits"
import { api } from "@/trpc/react"
import {
  createPacketSchema,
  type TcreatePacket,
} from "@/types/schema/packet-schema"

export function CreatePacketForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const router = useRouter()
  const utils = api.useUtils()
  const { toast } = useToast()

  const { mutate, isPending } = api.packet.create.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your packet has been created.",
      })
      await utils.company.subscriptions.invalidate()
      router.refresh()
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

  const form = useForm<TcreatePacket>({
    resolver: zodResolver(createPacketSchema),
    defaultValues: {
      name: "",
      description: "",
      cost: 0,
      rate: "MINUTE",
    },
  })

  const subscriptions = api.company.subscriptions.useQuery()
  const isValid = validateSubscriptionLimits({
    status: subscriptions.status,
    subscription: subscriptions.data?.subscription as Subscription,
    packetLen: subscriptions.data?._count.packets,
  })

  function onSubmit(values: TcreatePacket) {
    const { name, description, cost, rate } = values

    if (!isValid) {
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Max packet limit exceeded",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }

    mutate({
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
                <Input placeholder="description" {...field} />
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
                <FormControl className="uppercase">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={Rate.HOUR} className="uppercase">
                      {Rate.HOUR}
                    </SelectItem>
                    <SelectItem value={Rate.MINUTE} className="uppercase">
                      {Rate.MINUTE}
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
              Create Packet
            </Button>
          )}
        </SheetFooter>
      </form>
    </Form>
  )
}
