"use client"

import { LoadingSpinner } from "~/app/_components/loading"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { api } from "~/trpc/react"
import { CreatePoolTable } from "./create-pool-table"
import { DeletePoolTable } from "./delete-pool-table"
import { TogglePoolTable } from "./toggle-pool-table"
import { UpdatePoolTable } from "./update-pool-table"

export function PoolTableTab() {
  const { data: poolTableList, status } =
    api.poolTable.findAllByCompanyId.useQuery(undefined, {
      select(data) {
        return data.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { numeric: true }),
        )
      },
    })
  if (status === "pending") return <LoadingSpinner />
  return (
    <>
      <div className="text-right">
        <CreatePoolTable />
      </div>
      {status === "success" && !!poolTableList?.length && (
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
            {poolTableList.map((pool) => (
              <TableRow key={pool.id}>
                <TableCell className="w-[100px] font-medium">
                  {pool.id.slice(-8, pool.id.length)}
                </TableCell>
                <TableCell className="w-[200px] font-medium capitalize">
                  {pool.name}
                </TableCell>
                <TableCell className="capitalize">{pool.description}</TableCell>

                {/* START Actions */}
                <TableCell className="w-[100px] font-medium capitalize">
                  <TogglePoolTable
                    isActive={pool.isActive}
                    id={pool.id}
                    name={pool.name}
                    status={pool.status}
                  />
                </TableCell>
                <TableCell className="w-[100px] font-medium capitalize">
                  <UpdatePoolTable
                    isActive={pool.isActive}
                    id={pool.id}
                    name={pool.name}
                    description={pool.description as string}
                  />
                </TableCell>
                <TableCell className="w-[100px] font-medium capitalize">
                  <DeletePoolTable
                    isActive={pool.isActive}
                    id={pool.id}
                    name={pool.name}
                    status={pool.status}
                  />
                </TableCell>
                {/* END Actions */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}
