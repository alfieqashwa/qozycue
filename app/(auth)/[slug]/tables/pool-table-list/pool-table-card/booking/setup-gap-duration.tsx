import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import {
  type TUpdateGapDuration,
  updateGapDurationSchema,
} from "@/types/schema/pool-table-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"

export function SetupGapDuration({
  poolTableId,
  gapDuration,
}: {
  poolTableId: string
  gapDuration?: number
}) {
  const { toast } = useToast()
  const utils = api.useUtils()

  const form = useForm<TUpdateGapDuration>({
    resolver: zodResolver(updateGapDurationSchema),
    defaultValues: {
      poolTableId,
      gapDuration,
    },
  })

  const gapDurationWatch = form.watch("gapDuration")

  const { mutate, isPending } = api.poolTable.updateGapDuration.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Gap Duration has been updated.",
      })
      await utils.poolTable.invalidate()
      await utils.poolRental.invalidate()
      /* auto-closed after succeed submit the dialog form */
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

  function onSubmit(values: TUpdateGapDuration) {
    const { gapDuration } = values

    mutate({
      poolTableId,
      gapDuration,
    })
  }

  return (
    <div
      className={cn(
        !!gapDuration ? "flex justify-center md:justify-start" : "hidden",
        "pb-4",
      )}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-4">
          <FormField
            control={form.control}
            name="gapDuration"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="number"
                    min={5}
                    max={15}
                    placeholder="Gap Duration..."
                    className="w-[80px] font-medium capitalize text-amber-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="absolute" />
              </FormItem>
            )}
          />
          <DialogFooter className="">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  // use "==" instead of "===" b'coz I'm too lazy to convert the type.
                  disabled={isPending || gapDuration == gapDurationWatch}
                  variant="secondary"
                  size="icon"
                  className="text-amber-300 disabled:pointer-events-auto disabled:cursor-not-allowed"
                >
                  <Pencil size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="bg-muted text-muted-foreground"
              >
                Click it first if you want to update
              </TooltipContent>
            </Tooltip>
          </DialogFooter>
        </form>
      </Form>
    </div>
  )
}
