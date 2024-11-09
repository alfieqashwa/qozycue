"use client"

import { Rate } from "@prisma/client"
import { type ColumnDef } from "@tanstack/react-table"
import { Hash, Hourglass, ScrollText, Star, Timer } from "lucide-react"
import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { formattedPriceWithRupiah } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { type RouterOutputs } from "@/trpc/react"
import { ToggleSwitchPacket } from "../@products/toggle-switch"
import { PacketRowActions } from "./packet-row-actions"

export const columnsPacket: ColumnDef<
  RouterOutputs["packet"]["findAllByCompanyId"][0]
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const rate = row.getValue("rate")
      const colorBasedOnRate =
        rate === Rate.HOUR ? "text-sky-400" : "text-amber-300"
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
        rate === Rate.HOUR ? "text-sky-400" : "text-amber-300"
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <ScrollText className={cn("mr-2 h-4 w-4", colorBasedOnRate)} />
          <span className="whitespace-nowrap">
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
        rate === Rate.HOUR ? "text-sky-400" : "text-amber-300"
      return (
        <Badge
          variant="secondary"
          className={cn("px-3 py-1.5", colorBasedOnRate)}
        >
          <span className="max-w-[500px] truncate capitalize">
            {formattedPriceWithRupiah.format(Number(cost))}
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
          {rate === Rate.HOUR ? (
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
        original: { id, name, status },
      } = row
      return <ToggleSwitchPacket id={id} name={name} status={status} />
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="relative">
          <PacketRowActions row={row} />
        </div>
      )
    },
  },
]
