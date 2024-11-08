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
import { DeleteTax } from "./delete-tax"
import { ToggleTax } from "./toggle-tax"
import { UpdateTax } from "./update-tax"

export function TaxTab({ companyId }: { companyId: Id<"companies"> }) {
  const taxes = useTanstackQuery({
    ...convexQuery(api.taxes.findAllByCompanyId, { companyId }),
    enabled: Boolean(companyId),
  })

  return (
    <Table>
      <TableCaption>A list of taxes.</TableCaption>
      <TableHeader>
        <TableRow className="capitalize">
          <TableHead>ID</TableHead>
          <TableHead>name</TableHead>
          <TableHead>value</TableHead>
          <TableHead>isDefaultValue</TableHead>
          <TableHead className="sr-only">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {taxes.status === "success" &&
          taxes.data?.map((x) => (
            <TableRow key={x._id}>
              <TableCell className="w-[200px] font-medium">
                {x._id.slice(-8, x._id.length)}
              </TableCell>
              <TableCell className="w-[200px] font-medium capitalize">
                {x.name}
              </TableCell>
              <TableCell>{x.value}</TableCell>
              <TableCell>
                <ToggleTax
                  id={x._id}
                  isDefaultValue={x.isDefaultValue}
                  hasDefaultValueTax={taxes.data.some((x) => x.isDefaultValue)}
                />
              </TableCell>
              <TableCell className="w-[100px]">
                <UpdateTax
                  id={x._id}
                  value={x.value}
                  companyId={companyId}
                  isDefaultValue={x.isDefaultValue}
                />
              </TableCell>
              <TableCell className="w-[100px]">
                <DeleteTax
                  id={x._id}
                  name={x.name}
                  isDefaultValue={x.isDefaultValue}
                />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}
