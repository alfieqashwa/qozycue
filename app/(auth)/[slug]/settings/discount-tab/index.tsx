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
import { DeleteDiscount } from "./delete-discount"
import { UpdateDiscount } from "./update-discount"

export function DiscountTab({ companyId }: { companyId: Id<"companies"> }) {
  const { data: discounts, status } = useTanstackQuery(
    convexQuery(api.discounts.findAll, {}),
  )
  return (
    <Table>
      <TableCaption>A list of discounts.</TableCaption>
      <TableHeader>
        <TableRow className="capitalize">
          <TableHead>ID</TableHead>
          <TableHead>name</TableHead>
          <TableHead>value</TableHead>
          <TableHead className="sr-only">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {status === "success" &&
          discounts.map((disc) => (
            <TableRow key={disc._id}>
              <TableCell className="w-[200px] font-medium">
                {disc._id.slice(-8, disc._id.length)}
              </TableCell>
              <TableCell className="w-[200px] font-medium capitalize">
                {disc.name}
              </TableCell>
              <TableCell>{disc.value === 1 ? "free" : disc.value}</TableCell>
              <TableCell className="w-[100px]">
                <UpdateDiscount
                  id={disc._id}
                  name={disc.name}
                  value={disc.value}
                  companyId={companyId}
                />
              </TableCell>
              <TableCell className="w-[100px]">
                <DeleteDiscount id={disc._id} name={disc.name} />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
