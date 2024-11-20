import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { FunctionReturnType } from "convex/server"
import { ConvexError } from "convex/values"
import { Loader2, Minus, Plus, Send } from "lucide-react"
import { toast } from "sonner"

export function OrderProduct({
  isCashier,
  orderId,
  orderline,
  productId,
  name,
  price,
  qty,
  setQty,
}: {
  isCashier: boolean
  orderline:
    | FunctionReturnType<typeof api.orderlines.findAllByOrderId>[0]
    | undefined
  orderlineQty?: number
  orderId: Id<"orders">
  productId: Id<"products">
  name: string
  price: number
  qty: number
  setQty: React.Dispatch<React.SetStateAction<number>>
}) {
  const { mutate, isPending, variables } = useMutation({
    mutationFn: useConvexMutation(api.orderlines.upsert),
    onSuccess() {
      setQty(variables?.upsertOrderlineSchema.quantity as number)
      toast.success("Succeed!", {
        description: (
          <p>
            <span className="font-semibold capitalize">{name}</span> has been{" "}
            <span
              className={cn(
                !!orderline?._id ? "text-amber-400" : "text-emerald-400",
              )}
            >
              {!!orderline?._id ? "updated" : "created"}
            </span>
            .
          </p>
        ),
      })
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  const addOrderline = () => {
    mutate({
      upsertOrderlineSchema: {
        id: orderline?._id,
        orderId,
        orderlineStatus: orderline?.orderlineStatus,
        productId,
        quantity: qty,
        amount: price * qty,
      },
    })
  }
  return (
    <div className="mt-3 flex items-center justify-between whitespace-nowrap md:mt-6">
      <section>
        <Button
          variant="secondary"
          size="sm"
          disabled={!isCashier || qty < 1 || isPending}
          onClick={() => setQty((q) => q - 1)}
          className="font-semibold disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <Minus size={16} />
        </Button>
        <span className="px-2 font-medium md:text-xl">{qty}</span>
        <Button
          variant="secondary"
          size="sm"
          disabled={!isCashier || qty >= 20 || isPending}
          onClick={() => setQty((q) => q + 1)}
          className="font-semibold disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <Plus size={16} />
        </Button>
      </section>
      <Button
        size="sm"
        variant="secondary"
        disabled={
          !isCashier || qty <= 0 || qty === orderline?.quantity || isPending
        } // avoid user to update the server if qty is equal to current quantity
        onClick={addOrderline}
        className="font-semibold disabled:pointer-events-auto disabled:cursor-not-allowed"
      >
        {isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send
            size={16}
            className={cn(
              qty !== 0 && qty !== orderline?.quantity && "animate-pulse",
            )}
          />
        )}
      </Button>
    </div>
  )
}
