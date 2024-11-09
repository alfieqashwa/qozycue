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
import { convexQuery } from "@convex-dev/react-query"
import { useQuery as useTanstackQuery } from "@tanstack/react-query"
import { DeleteCategory } from "./delete-category"
import { UpdateCategory } from "./update-category"

export function CategoryTab() {
  const { data: categories, status } = useTanstackQuery(
    convexQuery(api.categories.findAll, {}),
  )

  return (
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
        {status === "success" &&
          categories.map((c) => (
            <TableRow key={c._id}>
              <TableCell className="w-[100px] font-medium">
                {c._id.slice(-8, c._id.length)}
              </TableCell>
              <TableCell className="w-[200px] font-medium capitalize">
                {c.name}
              </TableCell>
              <TableCell>{c.description}</TableCell>
              <TableCell className="w-[100px] text-right font-medium capitalize">
                <UpdateCategory
                  id={c._id}
                  name={c.name}
                  description={c.description as string}
                />
              </TableCell>
              <TableCell className="w-[100px] text-right font-medium capitalize">
                <DeleteCategory id={c._id} name={c.name} />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
