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
import { WrapperTooltip } from "@/components/wrapper-tooltip"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import {
  type TUpdateGapDuration,
  updateGapDurationSchema,
} from "@/types/schema/pool-table-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function SetupGapDuration({
  poolTableId,
  gapDuration,
}: {
  poolTableId: Id<"poolTables">
  gapDuration?: number
}) {
  const form = useForm<TUpdateGapDuration>({
    resolver: zodResolver(updateGapDurationSchema),
    defaultValues: {
      poolTableId,
      gapDuration,
    },
  })

  const gapDurationWatch = form.watch("gapDuration")

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.poolTables.updateGapDuration),

    onSuccess: () =>
      toast.success("Succeed!", {
        description: "Gap Duration has been updated.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  function onSubmit(values: TUpdateGapDuration) {
    const { gapDuration } = values

    mutate({
      updateGapDurationSchema: {
        poolTableId,
        gapDuration,
      },
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
                    className="w-[80px] font-medium text-amber-300 capitalize"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="absolute" />
              </FormItem>
            )}
          />
          <DialogFooter>
            <WrapperTooltip
              content="Click it first if you want to update"
              side="right"
            >
              <Button
                // use "==" instead of "===" b'coz I'm too lazy to convert the type.
                disabled={isPending || gapDuration == gapDurationWatch}
                variant="secondary"
                size="icon"
                className="text-amber-300 disabled:pointer-events-auto disabled:cursor-not-allowed"
              >
                <Pencil size={20} />
              </Button>
            </WrapperTooltip>
          </DialogFooter>
        </form>
      </Form>
    </div>
  )
}
