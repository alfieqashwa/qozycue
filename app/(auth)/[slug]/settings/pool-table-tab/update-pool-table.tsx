"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { ToastAction } from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"
import { api } from "~/trpc/react"
import {
  poolTableSchema,
  type TPoolTable,
} from "~/types/schema/pool-table-schema"

export const UpdatePoolTable = ({
  isActive,
  id,
  name,
  description,
}: {
  isActive: boolean
  id: string
  name: string
  description: string
}) => {
  const [open, setOpen] = useState(false)

  const utils = api.useUtils()
  const { toast } = useToast()

  const { mutate, isPending } = api.poolTable.update.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "The table has been updated.",
      })
      /* auto-closed after succeed submit the dialog form */
      await utils.poolTable.findAllByCompanyId.invalidate()
      setOpen(false)
    },
    onError(err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err.message || "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    },
  })

  // 1. Define your form.
  const form = useForm<TPoolTable>({
    resolver: zodResolver(poolTableSchema),
    defaultValues: {
      id,
      name,
      description,
      isActive: false,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: TPoolTable) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { id, name, description, isActive } = values

    mutate({
      id,
      name: name.toLowerCase(),
      description,
      isActive,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isActive}
          size="sm"
          variant="outline"
          className="disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <Pencil size={16} className="mr-1" />
          <span className="text-sm">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Table</DialogTitle>
          <DialogDescription>
            Klik Update setelah selesai memperbarui form.
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
                      placeholder="name"
                      className="capitalize"
                      {...field}
                    />
                  </FormControl>
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
