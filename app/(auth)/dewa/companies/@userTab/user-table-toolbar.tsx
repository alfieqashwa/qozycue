"use client"

import { roles, type Options } from "@/app/constants/options"
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/table/data-table-view-options"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Cross2Icon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"
import { Building2 } from "lucide-react"
// import { api } from "@/trpc/react"
import { api } from "@/convex/_generated/api"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { CreateUser } from "./create-user"

interface UserTableToolbarProps<TData> {
  table: Table<TData>
}
export function UserTableToolbar<TData>({
  table,
}: UserTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const { data, status } = useTanstackQuery({
    ...convexQuery(api.companies.findAll, {}),
    select(data) {
      const companies: Options[] = [...new Set(data.map((d) => d.name))].map(
        (company) => ({
          value: company,
          label: (
            <span className="capitalize">{company}</span>
          ) as unknown as string,
          icon: Building2,
        }),
      )
      return { companies }
    },
  })

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">
      <div className="flex w-full flex-col items-end space-x-2 space-y-2 md:flex-1 md:flex-row md:items-center md:space-y-0">
        <Input
          placeholder="Filter Email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[250px] sm:w-[150px] lg:w-[250px]"
        />
        {status === "success" && table.getColumn("company") && (
          <DataTableFacetedFilter
            column={table.getColumn("company")}
            title="Company"
            options={data.companies}
          />
        )}
        {table.getColumn("role") && (
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Role"
            options={roles}
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
        <CreateUser />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
