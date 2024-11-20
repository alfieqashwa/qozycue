"use client"

import { useState } from "react"
import { useMediaQuery } from "~/app/hooks/use-media-query"
import { type IOrderline } from "~/lib/types"
import { api } from "~/trpc/react"
import { PaymentCafeOnlyForm } from "./payment-cafe-only-form"
import {
  PaymentCafeOnlyDrawer,
  PaymentCafeOnlySheet,
} from "./payment-cafe-only-wrapper"

const DESCRIPTION = "Proceed to calculate payment"

export function PaymentCafeOnlyButton({
  isCashier,
  orderId,
  customerName,
  customerPhone,
  orderlines,
  hasOrderlines,
}: {
  isCashier: boolean
  orderId: string
  customerName?: string
  customerPhone?: string | null
  orderlines?: NonNullable<IOrderline[]>
  hasOrderlines: boolean
}) {
  const [open, setOpen] = useState(false)
  const { data: defaultTax, status } = api.tax.findDefaultValue.useQuery()

  const isDesktop = useMediaQuery("(min-width:768px)")

  if (isDesktop) {
    return (
      <PaymentCafeOnlySheet
        open={open}
        setOpen={setOpen}
        disabled={
          !isCashier ||
          !hasOrderlines ||
          orderlines?.some((o) => o.orderlineStatus === "UNORDERED")
        }
        description={DESCRIPTION}
      >
        {status === "success" && (
          <PaymentCafeOnlyForm
            orderId={orderId}
            customerName={customerName}
            customerPhone={customerPhone}
            orderlines={orderlines}
            defaultTax={defaultTax?.value}
            setOpen={setOpen}
          />
        )}
      </PaymentCafeOnlySheet>
    )
  }
  return (
    <PaymentCafeOnlyDrawer
      open={open}
      setOpen={setOpen}
      disabled={
        !isCashier ||
        !hasOrderlines ||
        orderlines?.some((o) => o.orderlineStatus === "UNORDERED")
      }
      description={DESCRIPTION}
    >
      {status === "success" && (
        <PaymentCafeOnlyForm
          orderId={orderId}
          customerName={customerName}
          customerPhone={customerPhone}
          orderlines={orderlines}
          defaultTax={defaultTax?.value}
          setOpen={setOpen}
        />
      )}
    </PaymentCafeOnlyDrawer>
  )
}
