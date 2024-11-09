"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Id } from "@/convex/_generated/dataModel"
import {
  createDiscountSchema,
  type TCreateDiscount,
} from "@/types/schema/discount-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { FilePlus2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const CreateDiscount = ({
  companyId,
}: {
  companyId: Id<"companies">
}) => {
  const [open, setOpen] = useState(false)

  const { mutate, isPending, variables } = useMutation({
    mutationFn: useConvexMutation(api.discounts.create),
    onSuccess: () => {
      toast.success("Succeed", {
        description: `Discount ${variables?.createDiscountSchema.value} has been created.`,
      })
    },
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

  const form = useForm<TCreateDiscount>({
    resolver: zodResolver(createDiscountSchema),
    defaultValues: {
      value: 0,
      companyId,
    },
  })

  function onSubmit(values: TCreateDiscount) {
    const { value } = values
    mutate({
      createDiscountSchema: {
        value,
        companyId,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <FilePlus2 size={16} className="mr-1" />
          <span>Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={() => form.reset()}
        className="bg-card sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>Create Discount</DialogTitle>
          <DialogDescription>
            Click <b>Submit</b> when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Value */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value in %</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="eg. 10, 15, 20"
                      className="w-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
