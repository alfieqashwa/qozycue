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
import { Status } from "@/types"
import {
  updatePoolTableSchema,
  type TUpdatePoolTable,
} from "@/types/schema/pool-table-schema"
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

export const UpdatePoolTable = ({
  isActive,
  id,
  name,
  status,
  companyId,
}: {
  id: Id<"poolTables">
  name: string
  isActive: boolean
  status: Status
  companyId: Id<"companies">
}) => {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.poolTables.update),
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

  const { data: hasPoolTableName } = useTanstackQuery({
    ...convexQuery(api.poolTables.findAll, {}),
    select(data) {
      return data.some((pool) => pool.name === form.watch("name"))
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

  const disabledUpdateButton =
    form.watch("name") == name || hasPoolTableName || isActive
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={isActive || status === "enabled"}
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" }),
          "flex items-center disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <Pencil size={16} />
        <span className="text-sm">Edit</span>
      </DialogTrigger>
      <DialogContent
        className="bg-card sm:max-w-[425px]"
        onCloseAutoFocus={() => form.reset()}
      >
        <DialogHeader>
          <DialogTitle>Edit Table {name}</DialogTitle>
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
                <Button disabled={disabledUpdateButton} type="submit">
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
