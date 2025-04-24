"use client"

import { useMediaQuery } from "@/app/hooks/use-media-query"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Status } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { useState } from "react"
import { UpdateProductDrawer } from "./update-product-drawer"
import { UpdateProductForm } from "./update-product-form"
import { UpdateProductSheet } from "./update-product-sheet"

type UpdateProductProps = {
  id: Id<"products">
  name: string
  costPrice: number
  salePrice: number
  status: Status
  categoryId: Id<"categories">
  unitOfMeasureId: Id<"unitOfMeasures">
}
export function UpdateProduct({
  id,
  name,
  costPrice,
  salePrice,
  status,
  categoryId,
  unitOfMeasureId,
}: UpdateProductProps) {
  const [open, setOpen] = useState(false)
  const description = "Click Update Product when you're sure to delete"

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const me = useTanstackQuery(convexQuery(api.users.me, {}))
  const managerAccessLevel = ["ZENITH", "ADMIN", "MANAGER"].includes(
    me.data?.role ?? "",
  )

  if (isDesktop) {
    return (
      <UpdateProductSheet
        open={open}
        setOpen={setOpen}
        status={status}
        name={name}
        description={description}
        managerAccessLevel={managerAccessLevel}
      >
        <UpdateProductForm
          id={id}
          name={name}
          costPrice={costPrice}
          salePrice={salePrice}
          categoryId={categoryId}
          unitOfMeasureId={unitOfMeasureId}
          setOpen={setOpen}
        />
      </UpdateProductSheet>
    )
  }
  return (
    <UpdateProductDrawer
      open={open}
      setOpen={setOpen}
      status={status}
      name={name}
      description={description}
      managerAccessLevel={managerAccessLevel}
    >
      <UpdateProductForm
        id={id}
        name={name}
        costPrice={costPrice}
        salePrice={salePrice}
        categoryId={categoryId}
        unitOfMeasureId={unitOfMeasureId}
        setOpen={setOpen}
      />
    </UpdateProductDrawer>
  )
}
