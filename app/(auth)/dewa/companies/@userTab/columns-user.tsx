"use client"

import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import type { ColumnDef } from "@tanstack/react-table"
import { FunctionReturnType } from "convex/server"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Building2, Key, Mail, User } from "lucide-react"
import Image from "next/image"
import { ActiveUser } from "./active-user"
import { DeleteUser } from "./delete-user"
import { UpdateUser } from "./update-user"
import { UserRowActions } from "./user-row-actions"

export const columnsUser: ColumnDef<
  FunctionReturnType<typeof api.users.findAll>[0]
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
    accessorKey: "avatar",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Avatar" className="ml-1" />
    ),
    cell: ({ row }) => {
      const userAvatar = row.original.image
      return (
        <div className="flex items-center">
          {userAvatar ? (
            <span className="relative ml-1 h-10 w-10">
              <Image
                src={userAvatar}
                alt="username"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-full bg-background object-cover text-muted-foreground ring-2 ring-ring ring-offset-2 ring-offset-background"
              />
            </span>
          ) : (
            <span className="relative ml-1">
              <User
                size={40}
                className="rounded-full bg-background object-cover p-1 text-muted-foreground ring-2 ring-ring ring-offset-2 ring-offset-background"
              />
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const {
        original: { _id, name },
      } = row
      return <ActiveUser id={_id} name={name} />
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Mail className="mr-2 h-4 w-4 text-primary" />
        <span>{row.getValue("email")}</span>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.original.role
      if (!role) return null
      return (
        <div className="flex items-center">
          <Key className="mr-2 h-4 w-4 text-primary" />
          <span>{row.getValue("role")}</span>
        </div>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "company",
    accessorFn: (row) => row.companyName,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      const companyName = row.getValue("company")
      return (
        <div className="flex items-center">
          <Building2
            className={cn(
              "mr-2 h-4 w-4",
              companyName ? "text-primary" : "text-muted-foreground",
            )}
          />
          <span className="whitespace-nowrap capitalize">
            {row.getValue("company")}
          </span>
        </div>
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
      return (
        <div className="whitespace-nowrap">
          {format(new Date(timestamp as Date), "PPpp", { locale: id })}
        </div>
      )
    },
  },
  {
    id: "update",
    cell: ({ row }) => {
      const {
        original: { _id, name, email, role, companyId },
      } = row
      return (
        <UpdateUser
          id={_id}
          name={name}
          email={email}
          role={role}
          companyId={companyId}
        />
      )
    },
  },
  {
    id: "delete",
    cell: ({ row }) => {
      const {
        original: { _id, email },
      } = row
      return <DeleteUser id={_id} email={email} />
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { email } = row.original
      return (
        <div className="relative">
          <UserRowActions email={email as string} />
        </div>
      )
    },
  },
]
