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
import { categorySchema, type TCategory } from "@/types/schema/category-schema"
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

export const UpdateCategory = ({
  id,
  name,
  description,
}: {
  id: Id<"categories">
  name: string
  description: string
}) => {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.categories.update),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "The category has been updated.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  const form = useForm<TCategory>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id,
      name,
      description,
    },
  })

  const { data: hasCategoryName } = useTanstackQuery({
    ...convexQuery(api.categories.findAll, {}),
    select(data) {
      return data.some((cat) => cat.name === form.watch("name"))
    },
  })

  function onSubmit(values: TCategory) {
    const { id, name, description } = values
    mutate({ categorySchema: { id, name: name.toLowerCase(), description } })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" }),
          "flex items-center",
        )}
      >
        <Pencil size={16} />
        <span className="text-sm">Edit</span>
      </DialogTrigger>
      <DialogContent className="bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Klik Update setelah selesai memperbarui form.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Name */}
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
                  <FormDescription>Category Name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="description"
                      {...field}
                      className="capitalize"
                    />
                  </FormControl>
                  <FormDescription>Description</FormDescription>
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
                <Button disabled={hasCategoryName} type="submit">
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
