"use client"

import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { api } from "@/convex/_generated/api"
import { formattedPriceBasedOnCountryCode } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { OrderlineStatus, StatusPayment } from "@/types"
import { type ColumnDef } from "@tanstack/react-table"
import { FunctionReturnType } from "convex/server"
import { format } from "date-fns"
import {
  Coffee,
  Hash,
  ShoppingBasket,
  Soup,
  Star,
  UtensilsCrossed,
} from "lucide-react"
import { OrderlineRowActions } from "./orderline-row-actions"

export const columnsOrderline = (
  locale: string,
  currency: string,
): ColumnDef<FunctionReturnType<typeof api.orderlines.findAll>[0]>[] => [
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
              <Star className="text-primary mr-2 h-4 w-4" />
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
            {formattedPriceBasedOnCountryCode(locale, currency).format(
              Number(productPrice),
            )}
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
      const isFree = row.original.isFree

      return (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className="px-3 py-1.5">
              <span
                className={cn(
                  "max-w-[500px] truncate capitalize",
                  isFree && "text-muted-foreground line-through",
                )}
              >
                {formattedPriceBasedOnCountryCode(locale, currency).format(
                  Number(costPrice),
                )}
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent
            side="left"
            className={cn(
              "bg-muted text-muted-foreground capitalize",
              isFree ? "visible" : "invisible",
            )}
          >
            free order
          </TooltipContent>
        </Tooltip>
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
              statusPayment === "OPEN"
                ? "text-emerald-300"
                : statusPayment === "PENDING"
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
    accessorKey: "_creationTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue("_creationTime")
      const formattedCreatedAt = format(timestamp as number, "PPpp")
      return <div className="whitespace-nowrap">{formattedCreatedAt}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { _id } = row.original
      return (
        <div className="relative">
          <OrderlineRowActions id={_id} />
        </div>
      )
    },
  },
]
