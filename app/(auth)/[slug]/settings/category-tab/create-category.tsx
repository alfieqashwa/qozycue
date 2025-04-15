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
import { cn } from "@/lib/utils"
import {
  createCategorySchema,
  type TCreateCategory,
} from "@/types/schema/category-schema"
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

export const CreateCategory = () => {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.categories.create),
    onSuccess: () =>
      toast.success("Succeed", {
        description: "New Category has been created.",
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

  const form = useForm<TCreateCategory>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const { data: hasCategoryName } = useTanstackQuery({
    ...convexQuery(api.categories.findAll, {}),
    select(data) {
      return data.some((cat) => cat.name === form.watch("name"))
    },
  })

  function onSubmit(values: TCreateCategory) {
    const { name, description } = values
    mutate({ createCategorySchema: { name: name.toLowerCase(), description } })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <FilePlus2 size={16} />
          <span>Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>
            Click <b>Submit</b> when you&apos;re done.
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
                      className="w-[200px] capitalize"
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
                      placeholder="Description"
                      className="w-[200px] capitalize"
                      {...field}
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
