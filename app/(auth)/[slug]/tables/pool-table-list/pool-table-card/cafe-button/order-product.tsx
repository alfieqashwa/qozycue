import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2, Minus, Plus, Send } from "lucide-react"

export function OrderProduct({
  isCashier,
  poolTableId,
  orderId,
  orderline,
  productId,
  name,
  price,
  qty,
  setQty,
}: {
  isCashier: boolean
  poolTableId: string
  orderline?: IOrderline
  orderlineQty?: number
  orderId: string
  productId: string
  name: string
  price: number
  qty: number
  setQty: React.Dispatch<React.SetStateAction<number>>
}) {
  const utils = api.useUtils()
  const { toast } = useToast()

  const { mutate, isPending, variables } = api.orderline.upsert.useMutation({
    async onSuccess() {
      await utils.order.findAllCafeOnlyByCompanyId.invalidate()
      await utils.order.findByPoolTableId.invalidate({ poolTableId })
      await utils.order.findById.invalidate()
      setQty(variables?.quantity as number)
      toast({
        title: "Succeed!",
        variant: "default",
        description: (
          <p>
            <span className="font-semibold capitalize">{name}</span> has been{" "}
            <span
              className={cn(
                !!orderline?.id ? "text-amber-400" : "text-emerald-400",
              )}
            >
              {!!orderline?.id ? "updated" : "created"}
            </span>
            .
          </p>
        ),
      })
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

  const addOrderline = () => {
    mutate({
      id: orderline?.id,
      orderId,
      orderlineStatus: orderline?.orderlineStatus,
      productId,
      quantity: qty,
      amount: price * qty,
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
