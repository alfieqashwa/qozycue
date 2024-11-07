"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
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
import { api } from "~/trpc/react"
import { uomSchema, type TUom } from "~/types/schema/unit-of-measure"

export const UpdateUom = ({
  id,
  name,
  disabledBasedOnAccessLevel,
}: {
  id: string
  name: string
  disabledBasedOnAccessLevel: boolean
}) => {
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const utils = api.useUtils()
  const { toast } = useToast()

  const { mutate, isPending } = api.unitOfMeasure.update.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "The UoM has been updated.",
      })
      await utils.unitOfMeasure.findAllByCompanyId.invalidate()
      router.refresh()
      /* auto-closed after succeed submit the dialog form */
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
  const form = useForm<TUom>({
    resolver: zodResolver(uomSchema),
    defaultValues: {
      id,
      name,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: TUom) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { id, name } = values

    mutate({ id, name: name.toLowerCase() })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          disabled={disabledBasedOnAccessLevel}
          className="disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <Pencil size={16} className="mr-1" />
          <span className="text-sm">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Unit of Measure</DialogTitle>
          <DialogDescription>
            Klik Update setelah selesai memperbarui form.
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
                  <FormDescription>
                    Contoh: pcs, item, bungkus, dan sbg-nya.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} type="submit">
              Update
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
