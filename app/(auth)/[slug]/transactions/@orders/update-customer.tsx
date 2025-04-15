import { zodResolver } from "@hookform/resolvers/zod"
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
import { cn } from "@/lib/utils"
import { StatusPayment } from "@/types"
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { ConvexError } from "convex/values"
import {
  type TUpdateCustomerByOrderId,
  updateCustomerByOrderIdSchema,
} from "@/types/schema/customer-schema"
import { Id } from "@/convex/_generated/dataModel"

export function UpdateCustomer({
  orderId,
  statusPayment,
  customerName,
  customerPhone,
  setOpen,
}: {
  orderId: Id<"orders">
  statusPayment: StatusPayment
  customerName?: string
  customerPhone?: string | null
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.customers.update),
    onSuccess: () =>
      // delete user from team
      toast.success("Succeed!", {
        description: "Updated customer info.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  const form = useForm<TUpdateCustomerByOrderId>({
    resolver: zodResolver(updateCustomerByOrderIdSchema),
    defaultValues: {
      orderId,
      name: customerName,
      phone: customerPhone ?? "",
    },
  })
  function onSubmit(values: TUpdateCustomerByOrderId) {
    const { name, phone } = values
    mutate({
      updateCustomerByOrderIdSchema: {
        orderId,
        name: name.toLowerCase(),
        phone,
      },
    })
  }

  return (
    <Dialog>
      <DialogTrigger
        disabled={statusPayment === "PAID"}
        className="group disabled:text-muted-foreground flex w-full items-center pl-2 text-sm disabled:pointer-events-auto disabled:cursor-not-allowed"
      >
        <User2 className="text-muted-foreground group-hover:text-primary mr-2 size-4" />
        <span>Edit Customer</span>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Update Customer</DialogTitle>
          <DialogDescription>
            Click <b>Update Customer</b> when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="whitespace-nowrap">
                    Customer Phone
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Customer Phone"
                      className="w-[200px]"
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
                  <Loader2 className="size-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit">
                  <User2 className="size-4" />
                  Update
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
