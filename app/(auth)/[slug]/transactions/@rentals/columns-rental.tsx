"use client"

import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { api } from "@/convex/_generated/api"
import { formattedPriceBasedOnCountryCode } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { StatusPayment } from "@/types"
import { type ColumnDef } from "@tanstack/react-table"
import { FunctionReturnType } from "convex/server"
import { format, isValid } from "date-fns"
import { Hash, Star } from "lucide-react"

export const columnsRental = (
  locale: string,
  currency: string,
): ColumnDef<FunctionReturnType<typeof api.poolRentals.findAll>[0]>[] => [
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
    accessorFn: (row) => row.poolTable?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Table" />
    ),
    cell: ({ row }) => {
      const { isBooking } = row.original
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <Star
            className={cn(
              "text-primary mr-2 h-4 w-4",
              isBooking && "animate-pulse",
            )}
          />
          <span className="whitespace-nowrap capitalize">
            Table {row.getValue("poolTable")}
          </span>
        </Badge>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  // hidden rate
  {
    accessorKey: "rate",
    accessorFn: (row) => row.packet?.rate,
    header: () => null,
    cell: () => null,
  },
  {
    accessorKey: "packet",
    accessorFn: (row) => row.packet?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Packet" />
    ),
    cell: ({ row }) => {
      const rate = row.getValue("rate")
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <span
            className={cn(
              "max-w-[500px] truncate capitalize",
              rate === "HOUR" ? "text-sky-400" : "text-amber-300",
            )}
          >
            {row.getValue("packet")}
          </span>
        </Badge>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "cost",
    accessorFn: (row) => row.packet?.cost,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cost" />
    ),
    cell: ({ row }) => {
      const costPrice = row.getValue("cost")

      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <span className="max-w-[500px] truncate capitalize">
            {formattedPriceBasedOnCountryCode(
              locale,
              currency,
              Number(costPrice),
            )}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "duration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => {
      const rate = row.getValue("rate")

      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <span
            className={cn(
              "max-w-[500px] truncate",
              rate === "HOUR" ? "text-sky-400" : "text-amber-300",
            )}
          >
            {row.getValue("duration")} {rate === "HOUR" ? "hr" : "min"}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "totalCost",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Cost" />
    ),
    cell: ({ row }) => {
      const costPrice = Number(row.getValue("totalCost")).toFixed(0)

      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <span className="max-w-[500px] truncate capitalize">
            {formattedPriceBasedOnCountryCode(
              locale,
              currency,
              Number(costPrice),
            )}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "statusPayment",
    accessorFn: (row) => row.order.statusPayment,
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
                ? "text-emerald-400"
                : statusPayment === "PENDING"
                  ? "text-amber-400"
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
    accessorKey: "timeStart",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start" />
    ),
    cell: ({ row }) => {
      const timeStart = row.getValue("timeStart")
      return (
        <div className="whitespace-nowrap text-sky-400">
          {timeStart && isValid(new Date(timeStart as number))
            ? format(timeStart as number, "pp")
            : "-"}
        </div>
      )
    },
  },
  {
    accessorKey: "timeEnd",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End" />
    ),
    cell: ({ row }) => {
      const timeEnd = row.getValue("timeEnd")
      if (!timeEnd) return "-"
      const formattedTimeEnd = format(timeEnd as number, "pp")
      return (
        <div className="whitespace-nowrap text-amber-300">
          {formattedTimeEnd}
        </div>
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
      return (
        <div className="whitespace-nowrap">
          {timestamp && isValid(new Date(timestamp as number))
            ? format(timestamp as number, "PP")
            : "-"}
        </div>
      )
    },
  },
]
