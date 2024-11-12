import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button, buttonVariants } from "~/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { ToastAction } from "~/components/ui/toast"
import { toast } from "~/components/ui/use-toast"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"
import {
  type TUpdateDuration,
  updateDurationSchema,
} from "~/types/schema/pool-rental-schema"

export function UpdateDuration({
  poolTableId,
  poolTableName,
  poolRentalId,
  duration,
}: {
  poolTableId: string
  poolTableName: string
  poolRentalId?: string
  duration: number
}) {
  const [open, setOpen] = useState(false)

  const utils = api.useUtils()
  const { mutate, isPending } = api.poolRental.updateDuration.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: <p>Table {poolTableName} has been updated.</p>,
      })

      await utils.poolTable.findAllByCompanyId.invalidate()
      await utils.order.findByPoolTableId.invalidate({ poolTableId })
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

  const form = useForm<TUpdateDuration>({
    resolver: zodResolver(updateDurationSchema),
    defaultValues: {
      poolTableId,
      poolRentalId,
      updatedDuration: duration,
    },
  })

  const updatedDurationWatch = form.watch("updatedDuration")

  function onSubmit(values: TUpdateDuration) {
    mutate({
      poolTableId,
      poolRentalId: poolRentalId!,
      updatedDuration: Number(values.updatedDuration),
    })
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="absolute -top-11 hidden size-7 -translate-x-1/2 text-xs font-bold text-muted-foreground shadow-xl transition-all duration-500 ease-in-out hover:bg-sky-950 hover:text-foreground group-hover:inline-flex"
        >
          H
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Duration</DialogTitle>
          <DialogDescription>
            Current duration is{" "}
            {duration > 1 ? `${duration} hrs` : `${duration} hr`}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="updatedDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl className="w-[200px]">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 5 }, (_, i) => 1 + i).map(
                        (i, _) => (
                          <SelectItem value={i.toString()} key={i}>
                            {i}
                            <span className="ml-1.5 text-sky-400">
                              {i <= 1 ? "hour" : "hours"}
                            </span>
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-24 md:pt-8">
              <DialogClose className={cn(buttonVariants({ variant: "ghost" }))}>
                Cancel
              </DialogClose>
              {isPending ? (
                <Button disabled>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  disabled={isPending || duration == updatedDurationWatch} // i'm using "==" instead of "===" is not typo
                  type="submit"
                  className="disabled:pointer-events-auto disabled:cursor-not-allowed"
                >
                  Update Duration
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
