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
  createPoolTableSchema,
  type TCreatePoolTable,
} from "@/types/schema/pool-table-schema"
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

export const CreatePoolTable = ({
  companyId,
}: {
  companyId: Id<"companies">
}) => {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.poolTables.create),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "New Table has been created.",
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

  const form = useForm<TCreatePoolTable>({
    resolver: zodResolver(createPoolTableSchema),
    defaultValues: {
      name: "",
      companyId,
    },
  })

  const { data: hasPoolTableName } = useTanstackQuery({
    ...convexQuery(api.poolTables.findAll, {}),
    select(data) {
      return data.some((pool) => pool.name === form.watch("name"))
    },
  })

  function onSubmit(values: TCreatePoolTable) {
    mutate({
      createPoolTableSchema: {
        name: values.name.toLowerCase(),
        companyId,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <FilePlus2 size={16} className="mr-1" />
          <span>Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Table</DialogTitle>
          <DialogDescription>
            Click <b>Submit</b> after fill the form.
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button disabled={hasPoolTableName} type="submit">
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
