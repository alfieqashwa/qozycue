"use client"

import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { api } from "@/convex/_generated/api"
import { type ColumnDef } from "@tanstack/react-table"
import { FunctionReturnType } from "convex/server"
import { format } from "date-fns"
import { Building2, Hash, Layers, Phone } from "lucide-react"
import { DeleteCompany } from "./delete-company"
import { ToggleIsPublished } from "./toggle-is-published"
import { UpdateCompany } from "./update-company"
import { UserList } from "./user-list"

export const columnsCompany: ColumnDef<
  FunctionReturnType<typeof api.companies.findAllSuperAdminProcedure>[0]
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
          <Hash className="text-primary mr-2 h-4 w-4" />
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
        <Building2 className="text-primary mr-2 h-4 w-4" />
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
        <Layers className="text-primary mr-2 h-4 w-4" />
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
        <Phone className="text-primary mr-2 h-4 w-4" />
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
          {format(new Date(timestamp as Date), "PPpp")}
        </div>
      )
    },
  },
  {
    id: "update",
    cell: ({ row }) => {
      const { _id, name, phone, countryCode, location, subscription } =
        row.original
      return (
        <UpdateCompany
          id={_id}
          name={name}
          phone={phone}
          countryCode={countryCode}
          location={location}
          subscription={subscription}
        />
      )
    },
  },
  {
    id: "delete",
    cell: ({ row }) => {
      const {
        original: { _id, name },
      } = row
      return <DeleteCompany id={_id} name={name} />
    },
  },
]
