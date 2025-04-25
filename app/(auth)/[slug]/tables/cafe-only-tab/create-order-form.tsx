"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
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
import { api } from "@/convex/_generated/api"
import {
  createCustomerSchema,
  TCreateCustomer,
} from "@/types/schema/customer-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogClose } from "@radix-ui/react-dialog"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2, Plus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateOrderForm({ isCashier }: { isCashier: boolean }) {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.customers.create),

    onSuccess: () =>
      toast.success("Succeed!", {
        description: "Create new order.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => {
      setOpen(false)
      form.reset()
    },
  })

  const form = useForm<TCreateCustomer>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  })

  function onSubmit(values: TCreateCustomer) {
    const { name, phone } = values

    mutate({
      createCustomerSchema: {
        name: name.toLowerCase(),
        phone: phone.trim(),
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="absolute -top-14 right-0">
        <Button
          disabled={isPending || !isCashier}
          variant="secondary"
          className="disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <Plus size={16} />
          New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Customer</DialogTitle>
          <DialogDescription>Customer name is mandatory</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                      className="max-w-[280px] capitalize"
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
                <FormItem className="pt-1">
                  <FormLabel className="sr-only">Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Phone"
                      {...field}
                      className="max-w-[280px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-row items-center justify-end space-x-2 pt-8">
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              {isPending ? (
                <Button
                  disabled
                  className="disabled:pointer-events-auto disabled:cursor-not-allowed"
                >
                  <Loader2 className="size-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit">Create Order</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
