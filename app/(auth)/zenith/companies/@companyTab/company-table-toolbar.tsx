"use client"

import { DataTableViewOptions } from "@/components/table/data-table-view-options"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Cross2Icon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"
import { CreateCompany } from "./create-company"

interface CompanyTableToolbarProps<TData> {
  table: Table<TData>
}

export function CompanyTableToolbar<TData>({
  table,
}: CompanyTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">
      <div className="flex w-full flex-col items-end space-x-2 space-y-2 md:flex-1 md:flex-row md:items-center md:space-y-0">
        <Input
          placeholder="Filter company..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[250px] md:w-[150px] lg:w-[250px]"
        />
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
      <DataTableViewOptions table={table} />
      <CreateCompany />
    </div>
  )
}
