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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { type TUom, uomSchema } from "@/types/schema/unit-of-measure-schema"
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

export const UpdateUom = ({
  id,
  name,
  description,
}: {
  id: Id<"unitOfMeasures">
  name: string
  description: string
}) => {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.unitOfMeasures.update),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "The UoM has been updated.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  const form = useForm<TUom>({
    resolver: zodResolver(uomSchema),
    defaultValues: {
      id,
      name,
      description,
    },
  })

  const { data: hasUomName } = useTanstackQuery({
    ...convexQuery(api.unitOfMeasures.findAll, {}),
    select(data) {
      return data.some((uom) => uom.name === form.watch("name"))
    },
  })

  function onSubmit(values: TUom) {
    const { id, name } = values
    mutate({
      uomSchema: {
        id,
        name: name.toLowerCase(),
        description: name.toLocaleLowerCase(), // for now leave it that way
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
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
          <DialogTitle>Edit Unit of Measure</DialogTitle>
          <DialogDescription>
            Click <b>Update UoM</b> when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name"
                      className="capitalize"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Eg: pcs, item, unit, etc.</FormDescription>
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
                title="Update UoM"
                isPending={isPending}
                disabled={hasUomName}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
