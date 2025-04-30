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
import { decimalToPercent } from "@/convex/helpers"
import { cn } from "@/lib/utils"
import { type TUpdateTax, updateTaxSchema } from "@/types/schema/tax-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const UpdateTax = ({
  id,
  value,
  companyId,
  isDefaultValue,
}: {
  id: Id<"taxes">
  value: number
  companyId: Id<"companies">
  isDefaultValue: boolean
}) => {
  const [open, setOpen] = useState(false)

  const { mutate, isPending, variables } = useMutation({
    mutationFn: useConvexMutation(api.taxes.update),
    onSuccess() {
      toast.success("Succeed!", {
        description: `Tax has been updated to ${variables?.updateTaxSchema.value.toFixed(0)}%.`,
      })
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => {
      setOpen(false)
    },
  })

  const val = decimalToPercent(value)
  const form = useForm<TUpdateTax>({
    resolver: zodResolver(updateTaxSchema),
    defaultValues: {
      id,
      value: val,
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

  function onSubmit(values: TUpdateTax) {
    const { id, value } = values
    mutate({ updateTaxSchema: { id, value, companyId } })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={isDefaultValue}
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Pencil />
        <span>Edit</span>
      </DialogTrigger>
      <DialogContent className="bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Tax</DialogTitle>
          <DialogDescription>
            Click <b>Update</b> when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Name */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value in %</FormLabel>
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
                title="Update"
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
