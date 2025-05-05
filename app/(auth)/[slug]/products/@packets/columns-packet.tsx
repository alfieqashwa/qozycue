"use client"

import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { api } from "@/convex/_generated/api"
import { formattedPriceBasedOnCountryCode } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { type ColumnDef } from "@tanstack/react-table"
import { FunctionReturnType } from "convex/server"
import { Hash, Hourglass, ScrollText, Star, Timer } from "lucide-react"
import { DeletePacket } from "./delete-packet"
import { TogglePacket } from "./toggle-packet"
import { UpdatePacket } from "./update-packet"

export const columnsPacket = (
  locale: string,
  currency: string,
): ColumnDef<FunctionReturnType<typeof api.packets.findAll>[0]>[] => [
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
          <Hash className="text-primary mr-2 h-4 w-4" />
          <span className="max-w-[300px] truncate font-medium">
            {id?.slice(-8, id?.length)}
          </span>
        </Badge>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const rate = row.getValue("rate")
      const colorBasedOnRate =
        rate === "HOUR" ? "text-sky-400" : "text-amber-300"
      return (
        <Badge
          variant="secondary"
          className={cn("px-3 py-1.5", colorBasedOnRate)}
        >
          <Star className="mr-2 h-4 w-4" />
          <span className="whitespace-nowrap capitalize">
            {row.getValue("name")}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const rate = row.getValue("rate")
      const colorBasedOnRate =
        rate === "HOUR" ? "text-sky-400" : "text-amber-300"
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <ScrollText className={cn("mr-2 h-4 w-4", colorBasedOnRate)} />
          <span className="font-medium whitespace-nowrap">
            {row.getValue("description")}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "cost",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Packet Price" />
    ),
    cell: ({ row }) => {
      const cost = row.getValue("cost")
      const rate = row.getValue("rate")
      const colorBasedOnRate =
        rate === "HOUR" ? "text-sky-400" : "text-amber-300"
      return (
        <Badge
          variant="secondary"
          className={cn("px-3 py-1.5", colorBasedOnRate)}
        >
          <span className="max-w-[500px] truncate capitalize">
            {formattedPriceBasedOnCountryCode(locale, currency, Number(cost))}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "rate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rate" />
    ),
    cell: ({ row }) => {
      const rate = row.getValue("rate")
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          {rate === "HOUR" ? (
            <Hourglass className="mr-2 size-4 text-sky-400" />
          ) : (
            <Timer className="mr-2 size-4 text-amber-300" />
          )}
          <span className="max-w-[500px] truncate uppercase">
            {row.getValue("rate")}
          </span>
        </Badge>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enabled?" />
    ),
    cell: ({ row }) => {
      const {
        original: { _id, name, status },
      } = row
      return <TogglePacket id={_id} name={name} status={status} />
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "update",
    cell: ({ row }) => {
      const { _id, name, description, cost, rate, status } = row.original
      return (
        <UpdatePacket
          id={_id}
          name={name}
          description={description}
          cost={cost}
          rate={rate}
          status={status}
        />
      )
    },
  },
  {
    id: "delete",
    cell: ({ row }) => {
      const { _id, name, status } = row.original
      return <DeletePacket id={_id} name={name} status={status} />
    },
  },
]
