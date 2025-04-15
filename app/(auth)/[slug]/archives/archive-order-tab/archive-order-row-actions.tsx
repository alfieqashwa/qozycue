"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Id } from "@/convex/_generated/dataModel"
import { Copy } from "lucide-react"
import { useState } from "react"

export function ArchiveOrderRowActions({ id }: { id: Id<"orders"> }) {
  const [open, setOpen] = useState(false)
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
        >
          <DotsHorizontalIcon className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(id)}
          className="group hover:cursor-pointer"
        >
          <Copy className="text-muted-foreground/70 group-hover:text-primary" />
          <span className="group-hover:text-primary">Copy ID</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
