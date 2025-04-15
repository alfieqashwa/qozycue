"use client"

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
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { decimalToPercent } from "@/convex/helpers"
import { cn } from "@/lib/utils"
import {
  updateDiscountSchema,
  type TUpdateDiscount,
} from "@/types/schema/discount-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2, Pencil } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const UpdateDiscount = ({
  id,
  name,
  value,
  companyId,
}: {
  id: Id<"discounts">
  name: string
  value: number
  companyId: Id<"companies">
}) => {
  const [open, setOpen] = useState(false)

  const { mutate, isPending, variables } = useMutation({
    mutationFn: useConvexMutation(api.discounts.update),
    onSuccess() {
      toast.success("Succeed!", {
        description: `Discount has been updated to ${variables?.updateDiscountSchema.value.toFixed(0)}%.`,
      })
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  const val = decimalToPercent(value)
  const form = useForm<TUpdateDiscount>({
    resolver: zodResolver(updateDiscountSchema),
    defaultValues: {
      id,
      value: val,
      companyId,
    },
  })

  const { data: hasDiscValue } = useTanstackQuery({
    ...convexQuery(api.discounts.findAll, {}),
    select(data) {
      return data.some(
        (disc) =>
          (disc.value * 100).toFixed(0) === form.watch("value").toString(),
      )
    },
  })

  function onSubmit(values: TUpdateDiscount) {
    const { id, value } = values
    mutate({
      updateDiscountSchema: { id, value, companyId },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" }),
          "flex items-center disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Pencil size={16} />
        <span className="text-sm">Edit</span>
      </DialogTrigger>
      <DialogContent className="bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Discount</DialogTitle>
          <DialogDescription>
            Click <b>Update</b> when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        {/* Value */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <DialogFooter>
              <DialogClose
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                Cancel
              </DialogClose>
              {isPending ? (
                <Button
                  disabled
                  variant="destructive"
                  className="disabled:pointer-events-auto disabled:cursor-not-allowed"
                >
                  <Loader2 className="size-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button disabled={hasDiscValue} type="submit">
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
