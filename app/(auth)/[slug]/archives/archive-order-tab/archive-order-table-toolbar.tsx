"use client"

import { paymentMethods, type Options } from "@/app/constants/options"
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/table/data-table-view-options"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { convexQuery } from "@convex-dev/react-query"
import { Cross2Icon } from "@radix-ui/react-icons"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { type Table } from "@tanstack/react-table"
import { Star } from "lucide-react"
import { DeleteOrderList } from "./delete-order-list"
import { RollbackOrderList } from "./rollback-order-list"

interface ArchiveOrderTableToolbarProps<TData> {
  table: Table<TData>
  disabledBasedOnAccessLevel: boolean
}
export function ArchiveOrderTableToolbar<TData>({
  table,
  disabledBasedOnAccessLevel,
}: ArchiveOrderTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const me = useTanstackQuery(convexQuery(api.users.me, {}))
  const managerAccessLevel =
    me.status === "success" &&
    (me.data?.role === "DEWA" ||
      me.data?.role === "ADMIN" ||
      me.data?.role === "MANAGER")

  const { data, status } = useTanstackQuery({
    ...convexQuery(api.poolTables.findAll, {}),
    select(data) {
      const pools: Options[] = [...new Set(data.map((d) => d.name))]
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .map((pool) => ({
          value: pool,
          label: pool,
          icon: Star,
        }))
      return { pools }
    },
  })

  return (
    <div className="flex flex-col items-center space-y-2 md:flex-row md:justify-between md:space-y-0">
      <div className="flex w-full flex-col items-end space-x-2 space-y-2 md:flex-1 md:flex-row md:items-center md:space-y-0">
        <Input
          placeholder="Filter ID..."
          value={
            (table.getColumn("_id")?.getFilterValue() as Id<"orders">) ?? ""
          }
          onChange={(event) =>
            table.getColumn("_id")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[250px]"
        />
        {status === "success" && table.getColumn("poolTable") && (
          <DataTableFacetedFilter
            column={table.getColumn("poolTable")}
            title="Table"
            options={data.pools}
          />
        )}
        {table.getColumn("paymentMethod") && (
          <DataTableFacetedFilter
            column={table.getColumn("paymentMethod")}
            title="Method"
            options={paymentMethods}
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
      <div className="flex flex-col space-y-1 md:flex-row-reverse md:items-center md:space-y-0">
        {!!table.getSelectedRowModel().rows.length && (
          <section className="sm:space-y-2 lg:space-y-0">
            <RollbackOrderList
              table={table}
              disabledBasedOnAccessLevel={disabledBasedOnAccessLevel}
            />
            <DeleteOrderList
              table={table}
              disabledBasedOnAccessLevel={!managerAccessLevel}
            />
          </section>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
