"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { api } from "@/trpc/react"
import { DeleteOrder } from "./delete-order"
import { RollbackOrder } from "./rollback-order"

export function ArchiveOrderRowActions({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const { data: me, status } = api.user.me.useQuery()

  /*
    Manager & Cashier can rollback the archive-order's back into the transaction list,
    but only Manager can delete them.
  */
  const managerAccessLevel =
    me?.role === "MANAGER" || me?.role === "ADMIN" || me?.role === "DEWA"

  const managerAndCashierAccessLevel =
    me?.role === "MANAGER" ||
    me?.role === "CASHIER" ||
    me?.role === "ADMIN" ||
    me?.role === "DEWA"

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(id)}
          className="group hover:cursor-pointer"
        >
          <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary" />
          <span className="group-hover:text-primary">Copy ID</span>
        </DropdownMenuItem>
        {status === "success" && !!managerAndCashierAccessLevel && (
          <DropdownMenuItem
            className="group"
            onSelect={(e) => e.preventDefault()}
          >
            <RollbackOrder id={id} setOpen={setOpen} />
          </DropdownMenuItem>
        )}
        {status === "success" && !!managerAccessLevel && (
          <DropdownMenuItem
            className="group"
            onSelect={(e) => e.preventDefault()}
          >
            <DeleteOrder id={id} setOpen={setOpen} />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
