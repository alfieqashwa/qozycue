"use client"

import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { formattedPriceWithRupiah } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import { type ColumnDef } from "@tanstack/react-table"
import { FunctionReturnType } from "convex/server"
import { Coffee, Hash, ShoppingBasket, Soup, Star, Tags } from "lucide-react"
import { DeleteProductForm } from "./delete-product-form"
import { ToggleProduct } from "./toggle-product"
import { UpdateProduct } from "./update-product"

export const columnsProduct = (
  isStockable: boolean,
): ColumnDef<FunctionReturnType<typeof api.products.findAll>[0]>[] => [
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
      const id: Id<"products"> = row.getValue("_id")
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <Hash className="text-muted-foreground mr-2 h-4 w-4" />
          <span className="max-w-[300px] truncate font-medium">
            {id?.slice(-8, id?.length)}
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
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("category")
      const colorBasedOnCategory =
        category === "food"
          ? "text-emerald-200"
          : category === "drink"
            ? "text-fuchsia-200"
            : "text-lime-200"
      return (
        <Badge
          variant="secondary"
          className={cn("px-3 py-1.5", colorBasedOnCategory)}
        >
          <Star className="mr-2 h-4 w-4" />
          <span className="whitespace-nowrap capitalize">
            {row.getValue("name")}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "costPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cost Price" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("category")
      const colorBasedOnCategory =
        category === "food"
          ? "text-emerald-200"
          : category === "drink"
            ? "text-fuchsia-200"
            : "text-lime-200"
      const costPrice = row.getValue("costPrice")

      return (
        <Badge
          variant="secondary"
          className={cn("px-3 py-1.5", colorBasedOnCategory)}
        >
          <span className="max-w-[500px] truncate font-medium capitalize">
            {formattedPriceWithRupiah.format(Number(costPrice))}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "salePrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sale Price" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("category")
      const colorBasedOnCategory =
        category === "food"
          ? "text-emerald-200"
          : category === "drink"
            ? "text-fuchsia-200"
            : "text-lime-200"
      const salePrice = row.getValue("salePrice")
      return (
        <Badge
          variant="secondary"
          className={cn("px-3 py-1.5", colorBasedOnCategory)}
        >
          <span className="max-w-[500px] truncate font-medium capitalize">
            {formattedPriceWithRupiah.format(Number(salePrice))}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "countInStock",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Stock"
        className={cn(isStockable ? "" : "hidden")}
      />
    ),
    cell: ({ row }) => {
      const category = row.getValue("category")
      const countInStock = row.getValue("countInStock") as number
      const colorBasedOnCategory =
        category === "food"
          ? "text-emerald-200"
          : category === "drink"
            ? "text-fuchsia-200"
            : "text-lime-200"
      return (
        <Badge
          variant="secondary"
          className={cn(
            "px-3 py-1.5",
            colorBasedOnCategory,
            isStockable ? "" : "hidden",
          )}
        >
          <span className="max-w-[500px] truncate font-medium uppercase">
            {countInStock}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "uom",
    accessorFn: (row) => row.unitOfMeasure?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UoM" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("category")
      const colorBasedOnCategory =
        category === "food"
          ? "text-emerald-200"
          : category === "drink"
            ? "text-fuchsia-200"
            : "text-lime-200"
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <Tags className={cn("mr-2 h-4 w-4", colorBasedOnCategory)} />
          <span className="max-w-[500px] truncate font-medium uppercase">
            {row.getValue("uom")}
          </span>
        </Badge>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "category",
    accessorFn: (row) => row.category?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.getValue("category")
      let tagIcon

      if (category === "food")
        tagIcon = <Soup className="mr-2 h-4 w-4 text-emerald-200" />
      if (category === "drink")
        tagIcon = <Coffee className="mr-2 h-4 w-4 text-fuchsia-200" />
      if (category === "others")
        tagIcon = <ShoppingBasket className="mr-2 h-4 w-4 text-lime-200" />

      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          {tagIcon}
          <span className="max-w-[500px] truncate capitalize">
            {row.getValue("category")}
          </span>
        </Badge>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Enabled?" />
    ),
    cell: ({ row }) => {
      const {
        original: { _id, name, status },
      } = row
      return <ToggleProduct id={_id} name={name} status={status} />
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "update",
    cell: ({ row }) => {
      const {
        _id,
        name,
        costPrice,
        salePrice,
        countInStock,
        status,
        categoryId,
        unitOfMeasureId,
      } = row.original
      return (
        <UpdateProduct
          id={_id}
          name={name}
          costPrice={costPrice}
          salePrice={salePrice}
          countInStock={countInStock as number}
          status={status}
          categoryId={categoryId}
          unitOfMeasureId={unitOfMeasureId}
        />
      )
    },
  },
  {
    id: "delete",
    cell: ({ row }) => {
      const { _id, name, status } = row.original
      return <DeleteProductForm id={_id} name={name} status={status} />
    },
  },
]
