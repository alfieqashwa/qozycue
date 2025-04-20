import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { FunctionReturnType } from "convex/server"
import { ConvexError } from "convex/values"
import { toast } from "sonner"

export function ToggleFree({
  orderline,
}: {
  orderline: FunctionReturnType<typeof api.orderlines.findAllByOrderId>[0]
}) {
  const { mutate, isPending, variables } = useMutation({
    mutationFn: useConvexMutation(api.orderlines.toggleIsFree),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: (
          <p>
            <span>
              {!variables?.isFree ? "Enabled" : "Disabled"} free of product
            </span>{" "}
            <span className="capitalize">{orderline.product.name}</span>
          </p>
        ),
      }),
    onError: (err) =>
      toast.error("Something went wrong!", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occured",
      }),
  })
  return (
    <div className="absolute -bottom-6 left-0 xl:bottom-0 xl:left-24">
      <button
        disabled={isPending}
        onClick={() =>
          mutate({
            orderlineId: orderline._id,
            isFree: orderline.isFree,
          })
        }
        className={cn(
          "bg-muted rounded-sm px-1 text-sm font-medium tracking-widest",
          orderline.isFree
            ? "text-amber-300"
            : "text-muted-foreground line-through",
        )}
      >
        Free
      </button>
    </div>
  )
}
