import { useMediaQuery } from "@/app/hooks/use-media-query"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { StatusPayment } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { useQueries as useTanstackQueries } from "@tanstack/react-query"
import { useState } from "react"
import { PaymentForm } from "./payment-form"
import { PaymentDrawer, PaymentSheet } from "./payment-wrapper"

export function PaymentButton({
  // isCashier,
  orderId,
  poolTableName,
  customerName,
  customerPhone,
  totalCost,
  statusPayment,
}: {
  // isCashier: boolean
  orderId: Id<"orders"> | undefined
  statusPayment: StatusPayment
  poolTableName: string
  customerName?: string
  customerPhone?: string
  totalCost?: number
}) {
  const [open, setOpen] = useState(false)

  const [{ data: defaultTax, status }, { data: orderlines }] =
    useTanstackQueries({
      queries: [
        convexQuery(api.taxes.findDefaultValue, {}),
        convexQuery(api.orderlines.findAllByOrderId, { orderId }),
      ],
    })

  const isDesktop = useMediaQuery("(min-width:768px)")
  if (isDesktop) {
    return (
      <PaymentSheet
        open={open}
        setOpen={setOpen}
        disabled={// !isCashier ||
        orderlines?.some((o) => o.orderlineStatus === "UNORDERED")}
        poolTableName={poolTableName}
      >
        {status === "success" && (
          <PaymentForm
            orderId={orderId!}
            customerName={customerName}
            customerPhone={customerPhone}
            totalCost={totalCost!}
            orderlines={orderlines}
            statusPayment={statusPayment}
            defaultTax={defaultTax?.value}
            setOpen={setOpen}
          />
        )}
      </PaymentSheet>
    )
  }

  return (
    <PaymentDrawer
      open={open}
      setOpen={setOpen}
      disabled={// !isCashier || orderlines?.some((o) => o.orderlineStatus === "UNORDERED")
      orderlines?.some((o) => o.orderlineStatus === "UNORDERED")}
      poolTableName={poolTableName}
    >
      {status === "success" && (
        <PaymentForm
          orderId={orderId!}
          customerName={customerName}
          customerPhone={customerPhone}
          totalCost={totalCost!}
          orderlines={orderlines}
          statusPayment={statusPayment}
          defaultTax={defaultTax?.value}
          setOpen={setOpen}
        />
      )}
    </PaymentDrawer>
  )
}
