"use client"

import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Doc } from "@/convex/_generated/dataModel"
import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Building2, Hash, Layers, Phone } from "lucide-react"
import { CompanyRowActions } from "./company-row-actions"
import { ToggleIsPublished } from "./toggle-is-published"
import { UserList } from "./user-list"
import { FunctionReturnType } from "convex/server"
import { api } from "@/convex/_generated/api"

export const columnsCompany: ColumnDef<
  FunctionReturnType<typeof api.companies.findAll>[0]
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
          <Hash className="mr-2 h-4 w-4 text-primary" />
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="px-3 py-1.5">
        <Building2 className="mr-2 h-4 w-4 text-primary" />
        <span className="whitespace-nowrap capitalize">
          {row.getValue("name")}
        </span>
      </Badge>
    ),
  },
  {
    accessorKey: "subscription",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subscription" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="px-3 py-1.5">
        <Layers className="mr-2 h-4 w-4 text-primary" />
        <span className="whitespace-nowrap capitalize">
          {row.getValue("subscription")}
        </span>
      </Badge>
    ),
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Published ?" />
    ),
    cell: ({ row }) => {
      const { _id, isPublished } = row.original
      return <ToggleIsPublished id={_id} isPublished={isPublished} />
    },
  },
  {
    id: "users",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Users" />
    ),
    cell: ({ row }) => {
      const { _id, name } = row.original
      return <UserList companyId={_id} companyName={name} />
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="px-3 py-1.5">
        <Phone className="mr-2 h-4 w-4 text-primary" />
        <span className="whitespace-nowrap capitalize">
          {row.getValue("phone")}
        </span>
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => (
      <span className="max-w-[300px] truncate whitespace-nowrap capitalize">
        {row.getValue("location")}
      </span>
    ),
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
          {format(new Date(timestamp as Date), "PPpp", { locale: id })}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { _id, name, phone, location, subscription } = row.original
      return (
        <div className="relative">
          <CompanyRowActions
            id={_id}
            name={name}
            phone={phone}
            location={location}
            subscription={subscription}
          />
        </div>
      )
    },
  },
]
