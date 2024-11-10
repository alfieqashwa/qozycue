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
import { Id } from "@/convex/_generated/dataModel"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { useState } from "react"
import { DeleteProductForm } from "./delete-product-form"
import { UpdateProduct } from "./update-product"
import { UpdateProductForm } from "./update-product-form"

// interface ProductRowActionsProps<TData> {
//   row: Row<TData>
// }

type ProductRowActionsProps = {
  id: Id<"products">
  name: string
  costPrice: number
  salePrice: number
  categoryId: string | null
  unitOfMeasureId: string | null
}

export function ProductRowActions({
  id,
  name,
  costPrice,
  salePrice,
  categoryId,
  unitOfMeasureId,
}: ProductRowActionsProps) {
  const [open, setOpen] = useState(false)
  // const product = productSchema.parse(row.original)
  const { data: me, status } = useTanstackQuery(convexQuery(api.users.me, {}))

  const adminAccessLevel = me?.role === "DEWA" || me?.role === "ADMIN"
  const managerAccessLevel =
    me?.role === "DEWA" || me?.role === "ADMIN" || me?.role === "MANAGER"

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
        <UpdateProduct name={name}>
          <UpdateProductForm
            id={id}
            name={name}
            costPrice={costPrice}
            salePrice={salePrice}
            categoryId={categoryId as string}
            unitOfMeasureId={unitOfMeasureId as string}
            setOpen={setOpen}
          />
        </UpdateProduct>
        {status === "success" && !!adminAccessLevel && (
          <DropdownMenuItem
            className="group"
            onSelect={(e) => e.preventDefault()}
          >
            <DeleteProductForm id={id} name={name} setOpen={setOpen} />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
