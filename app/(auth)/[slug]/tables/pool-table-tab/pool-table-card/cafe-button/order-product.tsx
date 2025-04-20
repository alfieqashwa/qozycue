import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { FunctionReturnType } from "convex/server"
import { ConvexError } from "convex/values"
import {
  Coffee,
  Loader2,
  Minus,
  Plus,
  Send,
  ShoppingBasket,
  Soup,
} from "lucide-react"
import { toast } from "sonner"

type OrderProductProps = {
  isCashier: boolean
  orderline:
    | FunctionReturnType<typeof api.orderlines.findAllByOrderId>[0]
    | undefined
  orderlineQty?: number
  orderId: Id<"orders">
  productId: Id<"products">
  name: string
  price: number
  isStockable: boolean
  countInStock: number
  qty: number
  setQty: React.Dispatch<React.SetStateAction<number>>
  stock: number
  setStock: React.Dispatch<React.SetStateAction<number>>
}

export function OrderProduct({
  isCashier,
  orderId,
  orderline,
  productId,
  name,
  price,
  isStockable,
  countInStock,
  qty,
  setQty,
  stock,
  setStock,
}: OrderProductProps) {
  const { data: category, status } = useTanstackQuery({
    ...convexQuery(api.categories.findByProductId, { productId }),
    enabled: Boolean(productId),
  })

  const classNames = {
    toast: cn(
      "flex items-center border-2 w-full pl-4 py-3 rounded-lg shadow-lg",
      {
        "bg-emerald-200/70 border-emerald-900": category?.name === "food",
        "bg-fuchsia-200/70 border-fuchsia-900": category?.name === "drink",
        "bg-lime-200/70 border-lime-900": category?.name === "others",
      },
    ),
    title: "pl-8 text-muted font-medium tracking-wide",
  }

  const icon =
    category?.name === "food" ? (
      <Soup
        size={28}
        strokeWidth={2.5}
        className="ml-2.5 animate-pulse text-emerald-900"
      />
    ) : category?.name === "drink" ? (
      <Coffee
        size={28}
        strokeWidth={2.5}
        className="ml-2.5 animate-pulse text-fuchsia-900"
      />
    ) : (
      <ShoppingBasket
        size={28}
        strokeWidth={2.5}
        className="ml-2.5 animate-pulse text-lime-900"
      />
    )

  const increaseQty = () => {
    setQty((q) => q + 1)
    isStockable && setStock((s) => s - 1)
  }
  const decreaseQty = () => {
    setQty((q) => q - 1)
    isStockable && setStock((s) => s + 1)
  }

  const { mutate, isPending, variables } = useMutation({
    mutationFn: useConvexMutation(api.orderlines.upsert),
    onSuccess() {
      setQty(variables?.upsertOrderlineSchema.quantity as number)

      toast(`${!!orderline?._id ? "Re-order!" : "Order!"}`, {
        unstyled: true,
        description: (
          <p className="text-muted/70 font-semibold capitalize">{name}</p>
        ),
        classNames,
        icon,
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
        orderlineStatus: orderline?.orderlineStatus,
        quantity: qty,
        amount: price * qty,
        productId,
        countInStock: isStockable ? stock : countInStock,
        orderId,
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
          onClick={decreaseQty}
          className="font-semibold disabled:pointer-events-auto disabled:cursor-not-allowed"
        >
          <Minus size={16} />
        </Button>
        <span className="px-2 font-medium md:text-xl">{qty}</span>
        <Button
          variant="secondary"
          size="sm"
          disabled={
            !isCashier || qty >= 20 || (stock < 1 && isStockable) || isPending
          }
          onClick={increaseQty}
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
