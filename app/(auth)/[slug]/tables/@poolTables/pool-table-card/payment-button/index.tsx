"use client"

import { type StatusPayment } from "@prisma/client"
import { useState } from "react"
import { useMediaQuery } from "~/app/hooks/use-media-query"
import { type IOrderline } from "~/lib/types"
import { api } from "~/trpc/react"
import { PaymentForm } from "./payment-form"
import { PaymentDrawer, PaymentSheet } from "./payment-wrapper"

export function PaymentButton({
  isCashier,
  orderId,
  poolTableName,
  customerName,
  customerPhone,
  totalCost,
  orderlines,
  statusPayment,
}: {
  isCashier: boolean
  orderId: string
  poolTableName: string
  customerName?: string
  customerPhone?: string | null
  totalCost: number
  orderlines?: NonNullable<IOrderline[]>
  statusPayment: StatusPayment
}) {
  const [open, setOpen] = useState(false)
  const { data: defaultTax, status } = api.tax.findDefaultValue.useQuery()

  const isDesktop = useMediaQuery("(min-width:768px)")
  if (isDesktop) {
    return (
      <PaymentSheet
        open={open}
        setOpen={setOpen}
        disabled={
          !isCashier ||
          orderlines?.some((o) => o.orderlineStatus === "UNORDERED")
        }
        poolTableName={poolTableName}
      >
        {status === "success" && (
          <PaymentForm
            orderId={orderId}
            customerName={customerName}
            customerPhone={customerPhone}
            totalCost={totalCost}
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
      disabled={
        !isCashier || orderlines?.some((o) => o.orderlineStatus === "UNORDERED")
      }
      poolTableName={poolTableName}
    >
      {status === "success" && (
        <PaymentForm
          orderId={orderId}
          customerName={customerName}
          customerPhone={customerPhone}
          totalCost={totalCost}
          orderlines={orderlines}
          statusPayment={statusPayment}
          defaultTax={defaultTax?.value}
          setOpen={setOpen}
        />
      )}
    </PaymentDrawer>
  )
}
