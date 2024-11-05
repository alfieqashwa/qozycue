"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Building2, Key, Mail, User } from "lucide-react"
import Image from "next/image"
import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { api } from "@/trpc/react"
import { type RouterOutputs } from "@/trpc/react"
import { DeleteTeam } from "./delete-team"
import { ResetSession } from "./reset-session"
import { UpdateTeam } from "./update-team"

export const columnsTeam: ColumnDef<
  RouterOutputs["user"]["findAllByCompanyId"][0]
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
      if (userAvatar) {
        return (
          <div className="flex items-center">
            <span className="relative ml-1 h-10 w-10">
              <Image
                src={userAvatar}
                alt="username"
                fill
                className="rounded-full bg-background object-cover text-muted-foreground ring-2 ring-ring ring-offset-2 ring-offset-background"
              />
            </span>
          </div>
        )
      } else {
        return (
          <div className="flex items-center">
            <span className="relative ml-1">
              <User
                size={40}
                className="rounded-full bg-background object-cover p-1 text-muted-foreground ring-2 ring-ring ring-offset-2 ring-offset-background"
              />
            </span>
          </div>
        )
      }
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const {
        original: { id, name },
      } = row

      const { data: sessions, status } =
        api.session.findAllByCompanyId.useQuery()
      const hasActiveUser =
        status === "success" && sessions?.some((active) => active.userId === id)

      return (
        <Badge
          variant="secondary"
          className={cn(
            "px-3 py-1.5",
            hasActiveUser ? "text-amber-300" : "text-muted-foreground",
          )}
        >
          <User className="mr-2 h-4 w-4" />
          <span className="whitespace-nowrap capitalize">
            {name ?? "pending"}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
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
          <Key className="mr-2 h-4 w-4 text-muted-foreground" />
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      const companyName = row.original.company?.name
      if (!companyName) return null
      return (
        <div className="flex items-center">
          <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="whitespace-nowrap capitalize">{companyName}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {format(row.getValue("createdAt"), "PPPPpp", { locale: id })}
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
        {format(row.getValue("updatedAt"), "PPPPpp", { locale: id })}
      </div>
    ),
  },
  {
    id: "reset",
    cell: ({ row }) => {
      const {
        original: { id, email },
      } = row

      return <ResetSession userId={id} email={email} />
    },
  },
  {
    id: "update",
    cell: ({ row }) => {
      const {
        original: { id, name, email, role },
      } = row

      return (
        <UpdateTeam id={id} username={name} email={email} currentRole={role} />
      )
    },
  },
  {
    id: "delete",
    cell: ({ row }) => {
      const {
        original: { id, email },
      } = row
      return <DeleteTeam id={id} email={email} />
    },
  },
]
