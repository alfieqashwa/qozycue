import { Button, buttonVariants } from "@/components/ui/button"
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
import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
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
    mutationFn: useConvexMutation(api.unitofmeasures.update),
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
          buttonVariants({ variant: "secondary", size: "sm" }),
          "flex items-center disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Pencil size={16} className="mr-1" />
        <span className="text-sm">Edit</span>
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
            <Button disabled={isPending} type="submit">
              Update UoM
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
