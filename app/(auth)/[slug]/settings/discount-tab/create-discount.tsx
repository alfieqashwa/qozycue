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
import { cn } from "@/lib/utils"
import {
  createDiscountSchema,
  type TCreateDiscount,
} from "@/types/schema/discount-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { FilePlus2, Loader2 } from "lucide-react"
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

  const { data: hasDiscValue } = useTanstackQuery({
    ...convexQuery(api.discounts.findAll, {}),
    select(data) {
      return data.some(
        (disc) =>
          (disc.value * 100).toFixed(0) === form.watch("value").toString(),
      )
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button disabled={hasDiscValue} type="submit">
                  Submit
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
