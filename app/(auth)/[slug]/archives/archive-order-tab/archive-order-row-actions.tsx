"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Copy } from "lucide-react"
import { useState } from "react"
import { DeleteOrder } from "./delete-order"
import { RollbackOrder } from "./rollback-order"
import { Id } from "@/convex/_generated/dataModel"

export function ArchiveOrderRowActions({ id }: { id: Id<"orders"> }) {
  const [open, setOpen] = useState(false)
  const { data: me, status } = useTanstackQuery(convexQuery(api.users.me, {}))

  /*
    Manager & Cashier can rollback the archive-order's back into the transaction list,
    but only Manager can delete them.
  */
  const managerAccessLevel = ["DEWA", "ADMIN", "MANAGER"].includes(
    me?.role ?? "",
  )
  const managerAndCashierAccessLevel = [
    "DEWA",
    "ADMIN",
    "MANAGER",
    "CASHIER",
  ].includes(me?.role ?? "")

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
