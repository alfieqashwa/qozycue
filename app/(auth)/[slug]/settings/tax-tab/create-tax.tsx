"use client"

import { Button } from "@/components/ui/button"
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
import { createTaxSchema, type TCreateTax } from "@/types/schema/tax-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { FilePlus2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const CreateTax = ({ companyId }: { companyId: Id<"companies"> }) => {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.taxes.create),
    onSuccess: () => {
      toast.success("Succeed", {
        description: "New Tax has been created.",
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
      name: "",
      value: 0,
      companyId,
    },
  })
  function onSubmit(values: TCreateTax) {
    const { name, value } = values
    mutate({
      createTaxSchema: {
        name: name.toLowerCase(),
        value,
        companyId,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <FilePlus2 size={16} className="mr-1" />
          <span>Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Tax</DialogTitle>
          <DialogDescription>
            Klik Submit setelah selesai mengisi form.
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
                  <FormDescription>Contoh: 6%, 11%, 21%</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Value */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Value" {...field} />
                  </FormControl>
                  <FormDescription>contoh: 0.06, 0.11, 0.21</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
