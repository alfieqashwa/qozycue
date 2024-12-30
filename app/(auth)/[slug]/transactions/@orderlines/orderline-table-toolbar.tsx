"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  categories,
  statusPayments,
  type Options,
} from "@/app/constants/options"
import { DataTableViewOptions } from "@/components/table/data-table-view-options"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Star, UtensilsCrossed } from "lucide-react"

interface OrderlineTableToolbarProps<TData> {
  table: Table<TData>
}
export function OrderlineTableToolbar<TData>({
  table,
}: OrderlineTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const { data, status } = useTanstackQuery({
    ...convexQuery(api.poolTables.findAll, {}),
    select(data) {
      let pools: Options[] = [...new Set(data.map((d) => d.name))]
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((pool) => ({
          value: pool,
          label: pool,
          icon: Star,
        }))
      pools.push({
        value: undefined,
        label: "cafe-only",
        icon: UtensilsCrossed,
      })
      return { pools }
    },
  })

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">
      <div className="flex w-full flex-col items-end space-x-2 space-y-2 md:flex-1 md:flex-row md:items-center md:space-y-0">
        <Input
          placeholder="Filter ID..."
          value={(table.getColumn("_id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("_id")?.setFilterValue(event.target.value)
          }
          className="hidden h-8 w-[250px] xl:block"
        />
        <Input
          placeholder="Filter Product..."
          value={
            (table.getColumn("productName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("productName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[250px] md:w-[150px] lg:w-[250px]"
        />
        {status === "success" && table.getColumn("poolTable") && (
          <DataTableFacetedFilter
            column={table.getColumn("poolTable")}
            title="Table"
            options={data.pools}
          />
        )}
        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Category"
            options={categories}
          />
        )}
        {table.getColumn("statusPayment") && (
          <DataTableFacetedFilter
            column={table.getColumn("statusPayment")}
            title="Status"
            options={statusPayments}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-col space-y-1 md:flex-row-reverse md:space-y-0">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
