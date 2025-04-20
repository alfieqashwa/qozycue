"use client"

import { useMediaQuery } from "@/app/hooks/use-media-query"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Status } from "@/types"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import dynamic from "next/dynamic"
import { useState } from "react"
import { UpdateProductForm } from "../update-product-form"

type UpdateProductProps = {
  id: Id<"products">
  name: string
  costPrice: number
  salePrice: number
  countInStock: number
  status: Status
  categoryId: Id<"categories">
  unitOfMeasureId: Id<"unitOfMeasures">
}
export function UpdateProduct({
  id,
  name,
  costPrice,
  salePrice,
  countInStock,
  status,
  categoryId,
  unitOfMeasureId,
}: UpdateProductProps) {
  const [open, setOpen] = useState(false)
  const description = "Click Update Product when you're sure to delete"

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const me = useTanstackQuery(convexQuery(api.users.me, {}))
  const managerAccessLevel = ["DEWA", "ADMIN", "MANAGER"].includes(
    me.data?.role ?? "",
  )

  const UpdateProductSheet = dynamic(
    () => import("./update-product-sheet.tsx"),
    { ssr: false },
  )
  const UpdateProductDrawer = dynamic(
    () => import("./update-product-drawer.tsx"),
    { ssr: false },
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
          countInStock={countInStock}
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
        countInStock={countInStock}
        categoryId={categoryId}
        unitOfMeasureId={unitOfMeasureId}
        setOpen={setOpen}
      />
    </UpdateProductDrawer>
  )
}
