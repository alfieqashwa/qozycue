"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { type Subscription } from "@prisma/client"
import { FilePlus2 } from "lucide-react"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { ToastAction } from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"
import { validateSubscriptionLimits } from "~/lib/validate-subscription-limits"
import { api } from "~/trpc/react"
import {
  createPoolTableSchema,
  type TCreatePoolTable,
} from "~/types/schema/pool-table-schema"

export const CreatePoolTable = () => {
  const [open, setOpen] = useState(false)

  const utils = api.useUtils()
  const { toast } = useToast()

  const subscriptions = api.company.subscriptions.useQuery()

  const { mutate, isPending } = api.poolTable.create.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed",
        variant: "default",
        description: "New Table has been created.",
      })
      await utils.poolTable.findAllByCompanyId.invalidate()
      await utils.company.subscriptions.invalidate()
      setOpen(false)
      form.reset()
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
  const form = useForm<TCreatePoolTable>({
    resolver: zodResolver(createPoolTableSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: false,
    },
  })

  const isValid = validateSubscriptionLimits({
    status: subscriptions.status,
    subscription: subscriptions.data?.subscription as Subscription,
    poolTableLen: subscriptions.data?._count.pooltables,
  })
  // 2. Define a submit handler.
  function onSubmit(values: TCreatePoolTable) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { name, description, isActive } = values

    if (!isValid) {
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        // description: "There was a problem with your request.",
        description: "Max pool-table limit exceeded",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }

    mutate({
      name: name.toLowerCase(),
      description,
      isActive,
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
                  <FormDescription>Contoh: 1, 2, 3, 4, 12</FormDescription>
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
                      {...field}
                      className="capitalize"
                    />
                  </FormControl>
                  <FormDescription>Description</FormDescription>
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
