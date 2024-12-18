"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { DeletePoolTable } from "./delete-pool-table"
import { TogglePoolTable } from "./toggle-pool-table"
import { UpdatePoolTable } from "./update-pool-table"

export function PoolTableTab({ companyId }: { companyId: Id<"companies"> }) {
  const { data: poolTableList, status } = useTanstackQuery({
    ...convexQuery(api.poolTables.findAll, {}),
    enabled: Boolean(companyId),
    select(data) {
      return data.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true }),
      )
    },
  })

  return (
    <Table>
      <TableCaption>A list of pool tables.</TableCaption>
      <TableHeader>
        <TableRow className="capitalize">
          <TableHead>ID</TableHead>
          <TableHead>name</TableHead>
          <TableHead>description</TableHead>
          <TableHead className="sr-only">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {status === "success" &&
          poolTableList.map((pool) => (
            <TableRow key={pool._id}>
              <TableCell className="w-[100px] font-medium">
                {pool._id.slice(-8, pool._id.length)}
              </TableCell>
              <TableCell className="w-[200px] font-medium capitalize">
                {pool.name}
              </TableCell>
              <TableCell className="whitespace-nowrap capitalize">
                {pool.description}
              </TableCell>

              {/* START Actions */}
              <TableCell className="w-[100px] font-medium capitalize">
                <TogglePoolTable
                  isActive={pool.isActive}
                  id={pool._id}
                  name={pool.name}
                  status={pool.status}
                />
              </TableCell>
              <TableCell className="w-[100px] font-medium capitalize">
                <UpdatePoolTable
                  isActive={pool.isActive}
                  id={pool._id}
                  name={pool.name}
                  status={pool.status}
                  companyId={companyId}
                />
              </TableCell>
              <TableCell className="w-[100px] font-medium capitalize">
                <DeletePoolTable
                  isActive={pool.isActive}
                  id={pool._id}
                  name={pool.name}
                  status={pool.status}
                />
              </TableCell>
              {/* END Actions */}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
