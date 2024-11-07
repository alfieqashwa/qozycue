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
import {
  createUomSchema,
  type TCreateUom,
} from "@/types/schema/unit-of-measure-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { FilePlus2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function CreateUom() {
  const [open, setOpen] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.unitofmeasures.create),
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
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <FilePlus2 size={16} className="mr-1" />
          Create UoM
        </Button>
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
                  <FormDescription>
                    Contoh: pcs, item, bungkus, dan sbg-nya.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} type="submit">
              Create UoM
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
