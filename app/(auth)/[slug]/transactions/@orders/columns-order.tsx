"use client"

import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { WrapperTooltip } from "@/components/wrapper-tooltip"
import { api } from "@/convex/_generated/api"
import { formattedPriceWithRupiah } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { PaymentMethod, StatusPayment } from "@/types"
import { type ColumnDef } from "@tanstack/react-table"
import { FunctionReturnType } from "convex/server"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
  Banknote,
  CreditCard,
  Hash,
  Key,
  Star,
  Tags,
  User2,
  UserRoundCheck,
  UtensilsCrossed,
  Wallet2,
} from "lucide-react"
import { ArchiveOrder } from "./archive-order"
import { OrderRowActions } from "./order-row-actions"
import { TriggerDetailButton } from "./trigger-detail-button"

export const columnsOrder: ColumnDef<
  FunctionReturnType<typeof api.orders.findAllSortedByDate>[0]
>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const id: string = row.getValue("_id")
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <Hash className="text-muted-foreground mr-2 h-4 w-4" />
          <span className="max-w-[300px] truncate">
            {id?.slice(-8, id.length)}
          </span>
        </Badge>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "poolTable",
    // accessorFn: (row) => row.poolTable?.name,
    accessorFn: (row) => row.poolRental?.poolTable?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Table" />
    ),
    cell: ({ row }) => {
      const poolTable = row.getValue("poolTable")
      const { poolRental } = row.original

      return (
        <>
          {!!poolTable ? (
            <Badge variant="secondary" className="px-3 py-1.5">
              <Star
                className={cn(
                  "text-primary mr-2 h-4 w-4",
                  poolRental.isBooking && "animate-pulse",
                )}
              />
              <span className="whitespace-nowrap capitalize">
                Table {poolTable as string}
              </span>
            </Badge>
          ) : (
            <Badge variant="secondary" className="px-3 py-1.5">
              <UtensilsCrossed className="mr-2 h-4 w-4 text-fuchsia-300" />
              <span className="whitespace-nowrap capitalize">Cafe Only</span>
            </Badge>
          )}
        </>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => {
      const costPrice = row.getValue("totalAmount")

      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          {!!costPrice ? (
            <span className="max-w-[500px] truncate capitalize">
              {formattedPriceWithRupiah.format(Number(costPrice))}
            </span>
          ) : (
            <span className="text-muted-foreground">Rp</span>
          )}
        </Badge>
      )
    },
  },
  {
    accessorKey: "statusPayment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status Payment" />
    ),
    cell: ({ row }) => {
      const statusPayment = row.getValue("statusPayment") as StatusPayment
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <span
            className={cn(
              "max-w-[500px] truncate",
              statusPayment === "OPEN"
                ? "text-emerald-400"
                : statusPayment === "PENDING"
                  ? "text-amber-400"
                  : "text-muted-foreground",
            )}
          >
            {statusPayment}
          </span>
        </Badge>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Method" />
    ),
    cell: ({ row }) => {
      const paymentMethod = row.getValue("paymentMethod")
      const icon = (paymentMethod: PaymentMethod) => {
        switch (paymentMethod) {
          case "CASH":
            return <Banknote className="mr-2 h-4 w-4 text-emerald-400" />
          case "CREDIT":
            return <CreditCard className="mr-2 h-4 w-4 text-rose-400" />
          case "DEBIT":
            return <Wallet2 className="mr-2 h-4 w-4 text-amber-400" />
          default:
            break
        }
      }

      if (!paymentMethod) return
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          {icon(paymentMethod as PaymentMethod)}
          <span className="max-w-[500px] truncate capitalize">
            {paymentMethod as PaymentMethod}
          </span>
        </Badge>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "discount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discount" />
    ),
    cell: ({ row }) => {
      const discount = Number(row.getValue("discount")) * 100
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <Tags
            className={cn(
              "mr-2 size-4",
              discount ? "text-primary" : "text-muted-foreground",
            )}
          />
          <span className="max-w-[500px] truncate uppercase">
            {!!discount ? discount + "%" : "-"}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "tax",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tax" />
    ),
    cell: ({ row }) => {
      const tax = Number(row.getValue("tax")) * 100
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <Tags
            className={cn(
              "mr-2 size-4",
              tax ? "text-primary" : "text-muted-foreground",
            )}
          />
          <span className="max-w-[500px] truncate uppercase">
            {!!tax ? tax + "%" : "-"}
          </span>
        </Badge>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "orderlines",
    accessorFn: (row) => row.orderlines.length,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Orderlines" />
    ),
    cell: ({ row }) => {
      const orderlineLen = Number(row.getValue("orderlines"))
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <UtensilsCrossed
            className={cn(
              "mr-2 size-4",
              orderlineLen ? "text-primary" : "text-muted-foreground",
            )}
          />
          <span className={cn(orderlineLen === 0 && "text-muted-foreground")}>
            {orderlineLen}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "customer",
    accessorFn: (row) => row.customer?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      const customer = row.getValue("customer") as string
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <UserRoundCheck
            className={cn(
              "mr-2 size-4",
              customer !== "anonymous"
                ? "text-primary"
                : "text-muted-foreground",
            )}
          />
          <span
            className={cn(
              customer === "anonymous" && "text-muted-foreground",
              "max-w-[500px] truncate capitalize",
            )}
          >
            {customer}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdBy",
    accessorFn: (row) => row.createdBy?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
    cell: ({ row }) => {
      const { createdBy } = row.original
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <WrapperTooltip
            side="right"
            icon={
              createdBy.role && <Key className="text-primary mr-2 h-4 w-4" />
            }
            content={createdBy.role as string}
          >
            <User2 className="text-primary mr-2 h-4 w-4 animate-pulse" />
          </WrapperTooltip>
          <span className="max-w-[500px] truncate capitalize">
            {row.getValue("createdBy")}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "_creationTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("_creationTime")
      const createdAt = format(timestamp as number, "PPpp", {
        locale: id,
      })
      return <p className="whitespace-nowrap">{createdAt}</p>
    },
  },
  {
    accessorKey: "updatedBy",
    accessorFn: (row) => row.updatedBy?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated By" />
    ),
    cell: ({ row }) => {
      const { updatedBy } = row.original

      if (!updatedBy.name) {
        return <p></p>
      }
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <WrapperTooltip
            side="right"
            icon={
              updatedBy.role && <Key className="text-primary mr-2 h-4 w-4" />
            }
            content={updatedBy.role as string}
          >
            <User2 className="text-primary mr-2 h-4 w-4 animate-pulse" />
          </WrapperTooltip>
          <span className="max-w-[500px] truncate capitalize">
            {row.getValue("updatedBy")}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "updatedTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("updatedTime")
      const updatedAt = timestamp
        ? format(timestamp as number, "PPpp", {
            locale: id,
          })
        : undefined

      return <p className={cn("space-y-2 whitespace-nowrap")}>{updatedAt}</p>
    },
  },
  {
    id: "detail",
    cell: ({ row }) => {
      const { _id, customer } = row.original
      return (
        <TriggerDetailButton
          orderId={_id}
          customerName={customer.name}
          customerPhone={customer.phone}
        />
      )
    },
  },
  {
    id: "remove",
    cell: ({ row }) => {
      const { _id, statusPayment } = row.original
      return <ArchiveOrder orderId={_id} statusPayment={statusPayment} />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // const { id, poolTableId, statusPayment, customer, createdBy } =
      const { _id, statusPayment, customer, poolRental } = row.original

      return (
        <div className="relative">
          <OrderRowActions
            orderId={_id}
            poolTableName={poolRental.poolTable.name}
            statusPayment={statusPayment}
            customerName={customer?.name}
          />
        </div>
      )
    },
  },
]
