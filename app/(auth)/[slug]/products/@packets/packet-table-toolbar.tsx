"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"

import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/table/data-table-view-options"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { packetRates, statusEnabled } from "@/app/constants/options"
import { api } from "@/trpc/react"
import { CreatePacket } from "./create-packet"
import { DeletePacketList } from "./delete-packet-list"

interface PacketTableToolbarProps<TData> {
  table: Table<TData>
}

export function PacketTableToolbar<TData>({
  table,
}: PacketTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const me = api.user.me.useQuery()
  const managerAccessLevel =
    me.status === "success" &&
    (me.data?.role === "DEWA" ||
      me.data?.role === "ADMIN" ||
      me.data?.role === "MANAGER")
  const adminAccessLevel =
    me.status === "success" &&
    (me.data?.role === "DEWA" || me.data?.role === "ADMIN")

  return (
    <div className="flex flex-col items-center space-y-2 md:flex-row md:justify-between md:space-y-0">
      <div className="flex w-full flex-col items-end space-x-2 space-y-2 md:flex-1 md:flex-row md:items-center md:space-y-0">
        <Input
          placeholder="Filter name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[250px] sm:w-[150px] lg:w-[250px]"
        />
        {table.getColumn("rate") && (
          <DataTableFacetedFilter
            column={table.getColumn("rate")}
            title="Rate"
            options={packetRates}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Enabled?"
            options={statusEnabled}
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
        {!table.getSelectedRowModel().rows.length ? (
          <CreatePacket disabledBasedOnAccessLevel={!managerAccessLevel} />
        ) : (
          <DeletePacketList
            table={table}
            disabledBasedOnAccessLevel={!adminAccessLevel}
          />
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
