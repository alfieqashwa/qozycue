"use client"

import { type OrderlineStatus, StatusPayment } from "@prisma/client"
import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
  Coffee,
  Hash,
  ShoppingBasket,
  Soup,
  Star,
  UtensilsCrossed,
} from "lucide-react"
import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { formattedPriceWithRupiah } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { type RouterOutputs } from "@/trpc/react"
import { OrderlineRowActions } from "./orderline-row-actions"

export const columnsOrderline: ColumnDef<
  RouterOutputs["orderline"]["findAllByCompanyId"][0]
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
    accessorFn: (row) => row.order?.poolRental?.poolTable?.name,
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
    accessorKey: "productName",
    accessorFn: (row) => row.product.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product Name" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("category")
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <span
            className={cn(
              "max-w-[500px] truncate capitalize",
              category === "food"
                ? "text-emerald-200"
                : category === "drink"
                  ? "text-fuchsia-200"
                  : "text-lime-200",
            )}
          >
            {row.getValue("productName")}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "orderlineStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Orderline Status" />
    ),
    cell: ({ row }) => {
      const orderlineStatus = row.getValue("orderlineStatus")
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <span
            className={cn(
              orderlineStatus === "ORDERED"
                ? "text-muted-foreground"
                : "text-amber-300",
              "max-w-[500px] truncate capitalize",
            )}
          >
            {orderlineStatus as OrderlineStatus}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "category",
    accessorFn: (row) => row.product?.category?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("category")
      let tagIcon

      if (category === "food")
        tagIcon = <Soup className="mr-2 h-4 w-4 text-emerald-200" />
      if (category === "drink")
        tagIcon = <Coffee className="mr-2 h-4 w-4 text-fuchsia-200" />
      if (category === "others")
        tagIcon = <ShoppingBasket className="mr-2 h-4 w-4 text-lime-200" />

      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          {tagIcon}
          <span
            className={cn(
              "max-w-[500px] truncate capitalize",
              category === "food"
                ? "text-emerald-200"
                : category === "drink"
                  ? "text-fuchsia-200"
                  : "text-lime-200",
            )}
          >
            {row.getValue("category")}
          </span>
        </Badge>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "productPrice",
    accessorFn: (row) => row.product.salePrice,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const productPrice = row.getValue("productPrice")
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <span className="max-w-[500px] truncate capitalize">
            {formattedPriceWithRupiah.format(Number(productPrice))}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => {
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <span className="max-w-[500px] truncate capitalize">
            {row.getValue("quantity")}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Price" />
    ),
    cell: ({ row }) => {
      const costPrice = row.getValue("amount")

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
    accessorFn: (row) => row.order?.statusPayment,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status Payment" />
    ),
    cell: ({ row }) => {
      const statusPayment = row.getValue("statusPayment")
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <span
            className={cn(
              "max-w-[500px] truncate capitalize",
              statusPayment === StatusPayment.OPEN
                ? "text-emerald-300"
                : statusPayment === StatusPayment.PENDING
                  ? "text-amber-300"
                  : "text-muted-foreground",
            )}
          >
            {statusPayment as StatusPayment}
          </span>
        </Badge>
      )
    },
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
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {format(row.getValue("updatedAt"), "PPpp", { locale: id })}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original
      return (
        <div className="relative">
          <OrderlineRowActions id={id} />
        </div>
      )
    },
  },
]
