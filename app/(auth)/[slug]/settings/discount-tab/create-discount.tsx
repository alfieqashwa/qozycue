"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { FilePlus2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
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
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/trpc/react"
import {
  createDiscountSchema,
  type TCreateDiscount,
} from "@/types/schema/discount-schema"

export const CreateDiscount = () => {
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const { mutate, isPending } = api.discount.create.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed",
        variant: "default",
        description: "New Discount has been created.",
      })
      router.refresh()
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
  const form = useForm<TCreateDiscount>({
    resolver: zodResolver(createDiscountSchema),
    defaultValues: {
      name: "",
      value: 0,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: TCreateDiscount) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { name, value } = values

    mutate({
      name: name.toLowerCase(),
      value,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          disabled={disabledBasedOnAccessLevel}
          className="disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <FilePlus2 size={16} className="mr-1" />
          <span>Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Discount</DialogTitle>
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
                  <FormDescription>contoh: 5%, 10%, 15%, 20%</FormDescription>
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
                  <FormDescription>
                    contoh: 0.05, 0.10, 0.15 0.20
                  </FormDescription>
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
