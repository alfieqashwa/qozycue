import { zodResolver } from "@hookform/resolvers/zod"
import { type StatusPayment } from "@prisma/client"
import { Loader2, User2 } from "lucide-react"
import { useForm } from "react-hook-form"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { api } from "@/trpc/react"
import { orderSchema, type TUpdateOrder } from "@/types/schema/order-schema"

export function UpdateCustomer({
  id,
  statusPayment,
  customerName,
  customerPhone,
  setOpen,
}: {
  id: string
  statusPayment: StatusPayment
  customerName?: string
  customerPhone?: string | null
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const utils = api.useUtils()
  const { toast } = useToast()

  const { mutate, isPending } = api.order.updateCustomerByOrderId.useMutation({
    async onSuccess() {
      // delete user from team
      toast({
        title: "Succeed!",
        variant: "default",
        description: `Updated customer info.`,
      })
      // await utils.order.findAllByCompanyId.invalidate()

      /* auto-closed after succeed submit the dialog form */
      await utils.order.invalidate()
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

  // 1. Define your form.
  const form = useForm<TUpdateOrder>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      id,
      customerName,
      customerPhone: customerPhone ?? "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: TUpdateOrder) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const { id, customerName, customerPhone } = values
    mutate({
      id,
      customerName,
      customerPhone,
    })
  }

  return (
    <Dialog>
      <DialogTrigger
        disabled={statusPayment === "PAID"}
        className="group flex w-full items-center pl-2 text-sm disabled:pointer-events-auto disabled:cursor-not-allowed disabled:text-muted-foreground"
      >
        <User2 className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary" />
        <span>Edit Customer</span>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Update Customer</DialogTitle>
          <DialogDescription>
            Click Update Customer when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="whitespace-nowrap">
                    Customer Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="customer name"
                      className="capitalize"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="whitespace-nowrap">
                    Customer Phone
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Customer Phone"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-8 flex flex-row items-center justify-end space-x-2">
              <DialogClose
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                Cancel
              </DialogClose>
              {isPending ? (
                <Button disabled variant="destructive" size="sm">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit">
                  <User2 className="mr-2 h-4 w-4" />
                  Update Customer
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
