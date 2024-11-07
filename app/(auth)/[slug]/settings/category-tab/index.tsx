"use client"

import { LoadingSpinner } from "@/app/_components/loading"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/trpc/react"
import { CreateCategory } from "./create-category"
import { DeleteCategory } from "./delete-category"
import { UpdateCategory } from "./update-category"

export function CategoryTab() {
  const { data: categories, status } = api.category.findAll.useQuery()
  if (status === "pending") return <LoadingSpinner />
  return (
    <>
      <div className="text-right">
        <CreateCategory />
      </div>
      {status === "success" && !!categories?.length && (
        <Table>
          <TableCaption>A list of categories.</TableCaption>
          <TableHeader>
            <TableRow className="capitalize">
              <TableHead>ID</TableHead>
              <TableHead>name</TableHead>
              <TableHead>description</TableHead>
              <TableHead className="sr-only">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="w-[100px] font-medium">
                  {c.id.slice(-8, c.id.length)}
                </TableCell>
                <TableCell className="w-[200px] font-medium capitalize">
                  {c.name}
                </TableCell>
                <TableCell>{c.description}</TableCell>
                <TableCell className="w-[100px] text-right font-medium capitalize">
                  <UpdateCategory
                    id={c.id}
                    name={c.name}
                    description={c.description as string}
                  />
                </TableCell>
                <TableCell className="w-[100px] text-right font-medium capitalize">
                  <DeleteCategory id={c.id} name={c.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}
