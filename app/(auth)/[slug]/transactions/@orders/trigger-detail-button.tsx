import { buttonVariants } from "@/components/ui/button"
import { DrawerTrigger } from "@/components/ui/drawer"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { ScrollText } from "lucide-react"
import { DetailButton } from "../../tables/pool-table-tab/pool-table-card/detail-button"

type TriggerDetailButtonProps = {
  orderId: Id<"orders">
  customerName?: string
  customerPhone?: string | null
}

export function TriggerDetailButton({
  orderId,
  customerName,
  customerPhone,
}: TriggerDetailButtonProps) {
  const { data: order, status: orderStatus } = useTanstackQuery({
    ...convexQuery(api.orders.findById, { id: orderId }),
    enabled: Boolean(orderId),
  })

  return (
    <DetailButton
      orderId={orderId}
      customerName={customerName}
      customerPhone={customerPhone}
      orderStatus={orderStatus}
      order={order}
    >
      <DrawerTrigger
        className={cn(
          buttonVariants({ variant: "secondary" }),
          "disabled:text-muted-foreground flex w-full items-center disabled:pointer-events-auto disabled:cursor-not-allowed",
        )}
      >
        <ScrollText className="text-primary size-4" />
        <span>Detail</span>
      </DrawerTrigger>
    </DetailButton>
  )
}
