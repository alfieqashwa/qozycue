"use client"

import { PaymentMethod } from "@prisma/client"
import { type ColumnDef } from "@tanstack/react-table"
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
import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { formattedPriceWithRupiah } from "@/lib/format-price"
import { type RouterOutputs } from "@/trpc/react"
import { ArchiveOrderRowActions } from "./archive-order-row-actions"

export const columnsArchiveOrder: ColumnDef<
  RouterOutputs["order"]["findAllByCompanyId"][0]
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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const id: string = row.getValue("id")
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="max-w-[300px] truncate">
            {id.slice(-8, id.length)}
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
      return (
        <>
          {!!poolTable ? (
            <Badge variant="secondary" className="px-3 py-1.5">
              <Star className="mr-2 h-4 w-4 text-primary" />
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
          <span className="max-w-[500px] truncate capitalize">
            {formattedPriceWithRupiah.format(Number(costPrice))}
          </span>
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
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <span className="max-w-[500px] truncate text-rose-500">
            {row.getValue("statusPayment")}
          </span>
        </Badge>
      )
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
          case PaymentMethod.CASH:
            return <Banknote className="mr-2 h-4 w-4 text-emerald-400" />
          case PaymentMethod.CREDIT:
            return <CreditCard className="mr-2 h-4 w-4 text-rose-400" />
          case PaymentMethod.DEBIT:
            return <Wallet2 className="mr-2 h-4 w-4 text-amber-400" />
          default:
            break
        }
      }
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
          <Tags className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="max-w-[500px] truncate uppercase">
            {discount ?? 0} %
          </span>
        </Badge>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
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
          <Tags className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="max-w-[500px] truncate uppercase">{tax ?? 0} %</span>
        </Badge>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "orderlines",
    accessorFn: (row) => row._count.orderLines,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Orderlines" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="px-3 py-1.5">
        <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="max-w-[500px] truncate">
          {row.getValue("orderlines")}
        </span>
      </Badge>
    ),
  },
  {
    accessorKey: "role",
    accessorFn: (row) => row.createdBy?.role,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role As" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="px-3 py-1.5">
        <Key className="mr-2 h-4 w-4 text-primary" />
        <span className="max-w-[500px] truncate">{row.getValue("role")}</span>
      </Badge>
    ),
  },
  {
    accessorKey: "customer",
    accessorFn: (row) => row.customer?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="px-3 py-1.5">
        <UserRoundCheck className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="max-w-[500px] truncate capitalize">
          {!!row.getValue("customer") ? row.getValue("customer") : "Anonymous"}
        </span>
      </Badge>
    ),
  },
  {
    accessorKey: "createdBy",
    accessorFn: (row) => row.createdBy?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="px-3 py-1.5">
        <User2 className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="max-w-[500px] truncate">
          {row.getValue("createdBy")}
        </span>
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {format(row.getValue("createdAt"), "PPpp", { locale: id })}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original
      return (
        <div className="relative">
          <ArchiveOrderRowActions id={id} />
        </div>
      )
    },
  },
]
