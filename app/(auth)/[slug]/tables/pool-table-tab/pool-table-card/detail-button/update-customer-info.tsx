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
import { DrawerDescription } from "@/components/ui/drawer"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { WrapperTooltip } from "@/components/wrapper-tooltip"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { StatusPayment } from "@/types"
import {
  type TUpdateCustomerByOrderId,
  updateCustomerByOrderIdSchema,
} from "@/types/schema/customer-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2, Phone, User2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function UpdateCustomerInfo({
  orderId,
  customerName,
  customerPhone,
  statusPayment,
}: {
  orderId: Id<"orders">
  customerName: string
  customerPhone: string
  statusPayment: StatusPayment
}) {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <WrapperTooltip content="Update Customer" side="left">
        <DialogTrigger
          disabled={statusPayment !== "OPEN" && statusPayment !== "PENDING"}
          className="group space-y-1 disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <DrawerDescription className="flex space-x-2 capitalize">
            <User2
              size={16}
              className="group-hover:text-primary transition-colors duration-500 ease-in-out"
            />
            <span className="text-foreground font-medium">{customerName}</span>
          </DrawerDescription>
          <DrawerDescription className="flex space-x-2 text-xs capitalize">
            <Phone
              size={16}
              className="group-hover:text-primary transition-colors duration-500 ease-in-out"
            />
            <span className="text-muted-foreground font-medium tracking-wider">
              {customerPhone}
            </span>
          </DrawerDescription>
        </DialogTrigger>
      </WrapperTooltip>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Update Customer</DialogTitle>
          <DialogDescription>
            Click <b>Update Customer</b> when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <UpdateCustomerInfoFrom
          orderId={orderId}
          customerName={customerName}
          customerPhone={customerPhone}
          setOpenDialog={setOpenDialog}
        />
      </DialogContent>
    </Dialog>
  )
}

const UpdateCustomerInfoFrom = ({
  orderId,
  customerName,
  customerPhone,
  setOpenDialog,
}: {
  orderId: Id<"orders">
  customerName: string
  customerPhone: string
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
}) => {
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
    onSettled: () => setOpenDialog(false),
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="whitespace-nowrap">Customer Name</FormLabel>
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
          <DialogClose className={cn(buttonVariants({ variant: "secondary" }))}>
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
  )
}
