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
  createUomSchema,
  type TCreateUom,
} from "@/types/schema/unit-of-measure-schema"
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

export function CreateUom() {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.unitOfMeasures.create),
    onSuccess: () =>
      toast.success("Succeed", {
        description: "New UoM has been created.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  const form = useForm<TCreateUom>({
    resolver: zodResolver(createUomSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const { data: hasUomName } = useTanstackQuery({
    ...convexQuery(api.unitOfMeasures.findAll, {}),
    select(data) {
      return data.some((uom) => uom.name === form.watch("name"))
    },
  })

  function onSubmit(values: TCreateUom) {
    const { name } = values
    mutate({
      createUomSchema: {
        name: name.toLowerCase(),
        description: name.toLocaleLowerCase(),
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
        <FilePlus2 size={16} />
        <span>Create</span>
      </DialogTrigger>
      <DialogContent className="bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Unit of Measure</DialogTitle>
          <DialogDescription>
            Click <b>Create UoM</b> when you&apos;re done.
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
                      placeholder="name of unit of measure"
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
                <Button disabled={hasUomName} type="submit">
                  Create UoM
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
