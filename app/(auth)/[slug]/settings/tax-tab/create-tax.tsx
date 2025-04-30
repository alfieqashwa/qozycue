"use client"

import { SubmitButton } from "@/components/submit-button"
import { buttonVariants } from "@/components/ui/button"
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
import { createTaxSchema, type TCreateTax } from "@/types/schema/tax-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { FilePlus2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const CreateTax = ({ companyId }: { companyId: Id<"companies"> }) => {
  const [open, setOpen] = useState(false)

  const { mutate, isPending, variables } = useMutation({
    mutationFn: useConvexMutation(api.taxes.create),
    onSuccess: () => {
      toast.success("Succeed", {
        description: `Tax ${variables?.createTaxSchema.value}% has been created.`,
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

  const form = useForm<TCreateTax>({
    resolver: zodResolver(createTaxSchema),
    defaultValues: {
      value: 0,
      companyId,
    },
  })

  const { data: hasTaxValue } = useTanstackQuery({
    ...convexQuery(api.taxes.findAll, {}),
    select(data) {
      return data.some(
        (tax) =>
          (tax.value * 100).toFixed(0) === form.watch("value").toString(),
      )
    },
  })

  function onSubmit(values: TCreateTax) {
    const { value } = values
    mutate({
      createTaxSchema: {
        value,
        companyId,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants(),
          "disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <FilePlus2 />
        <span>Create</span>
      </DialogTrigger>
      <DialogContent className="bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Tax</DialogTitle>
          <DialogDescription>
            Click <b>Submit</b> when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax in %</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="eg. 6, 11, 21"
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
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Cancel
              </DialogClose>
              <SubmitButton
                title="Submit"
                isPending={isPending}
                disabled={hasTaxValue}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
