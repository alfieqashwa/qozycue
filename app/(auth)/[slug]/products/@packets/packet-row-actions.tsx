"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type Row } from "@tanstack/react-table"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { api } from "@/trpc/react"
import { packetSchema } from "@/types/schema/packet-schema"
import { DeletePacket } from "./delete-packet"
import { UpdatePacket } from "./update-packet"
import { UpdatePacketForm } from "./update-packet-form"

interface PacketRowActionsProps<TData> {
  row: Row<TData>
}

export function PacketRowActions<TData>({ row }: PacketRowActionsProps<TData>) {
  const [open, setOpen] = useState(false)
  const packet = packetSchema.parse(row.original)

  const { data: me, status } = api.user.me.useQuery()

  const managerAccessLevel =
    me?.role === "ADMIN" || me?.role === "DEWA" || me?.role === "MANAGER"
  const adminAccessLevel = me?.role === "DEWA" || me?.role === "ADMIN"

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {status === "success" && !!managerAccessLevel && (
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent align="end" className="w-[160px]">
        {/* //! I remove DropdownMenuItem because bug: cannot input space-bar */}
        {/* <DropdownMenuItem
          className="group"
          onSelect={(e) => e.preventDefault()}
        >
        {...}
        </DropdownMenuItem> */}
        <UpdatePacket name={packet.name}>
          <UpdatePacketForm packet={packet} setOpen={setOpen} />
        </UpdatePacket>
        {status === "success" && !!adminAccessLevel && (
          <DropdownMenuItem
            className="group"
            onSelect={(e) => e.preventDefault()}
          >
            <DeletePacket
              id={packet.id}
              name={packet.name}
              open={open}
              setOpen={setOpen}
            />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
