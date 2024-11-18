"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { statusPayments, type Options } from "@/app/constants/options"
import { DataTableViewOptions } from "@/components/table/data-table-view-options"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { Star } from "lucide-react"

interface RentalTableToolbarProps<TData> {
  table: Table<TData>
}
export function RentalTableToolbar<TData>({
  table,
}: RentalTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const poolTables = useTanstackQuery({
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

  const packetList = useTanstackQuery({
    ...convexQuery(api.packets.findAll, {}),
    select(data) {
      const packets: Options[] = [...new Set(data.map((d) => d.name))].map(
        (packet) => ({
          value: packet,
          label: (
            <span className="capitalize">{packet}</span>
          ) as unknown as string,
          icon: Star,
        }),
      )
      return { packets }
    },
  })

  return (
    <div className="flex flex-col items-center space-y-2 md:flex-row md:justify-between md:space-y-0">
      <div className="flex w-full flex-col items-end space-x-2 space-y-2 md:flex-1 md:flex-row md:items-center md:space-y-0">
        <Input
          placeholder="Filter ID..."
          value={(table.getColumn("_id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("_id")?.setFilterValue(event.target.value)
          }
          className="hidden h-8 w-[250px] xl:block"
        />
        {poolTables.status === "success" && table.getColumn("poolTable") && (
          <DataTableFacetedFilter
            column={table.getColumn("poolTable")}
            title="Table"
            options={poolTables.data?.pools}
          />
        )}
        {packetList.status === "success" && table.getColumn("packet") && (
          <DataTableFacetedFilter
            column={table.getColumn("packet")}
            title="Packet"
            options={packetList.data?.packets}
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
