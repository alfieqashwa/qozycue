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
import {
  updatePoolTableSchema,
  type TUpdatePoolTable,
} from "@/types/schema/pool-table-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const UpdatePoolTable = ({
  isActive,
  id,
  name,
  companyId,
}: {
  id: Id<"poolTables">
  name: string
  isActive: boolean
  companyId: Id<"companies">
}) => {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.pooltables.update),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "The table has been updated.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  const form = useForm<TUpdatePoolTable>({
    resolver: zodResolver(updatePoolTableSchema),
    defaultValues: {
      id,
      name,
      companyId,
    },
  })
  function onSubmit(values: TUpdatePoolTable) {
    const { id, name } = values
    mutate({
      updatePoolTableSchema: {
        id,
        name: name.toLowerCase(),
        companyId,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={isActive}
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
          <DialogTitle>Edit Table</DialogTitle>
          <DialogDescription>
            Click <b>Update</b> when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="name"
                      className="w-[200px] capitalize"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use number! eg: 1, 2, 3, 4, 12
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isActive || isPending}
              type="submit"
              className="disabled:pointer-events-auto disabled:cursor-not-allowed"
            >
              Update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
