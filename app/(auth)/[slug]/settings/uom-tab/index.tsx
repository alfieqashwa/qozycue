"use client"

import { LoadingSpinner } from "@/components/loading-spinner"
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
import { CreateUom } from "./create-uom"
import { DeleteUom } from "./delete-uom"
import { UpdateUom } from "./update-uom"

export function UoMTab({ companyId }: { companyId: Id<"companies"> }) {
  const { data: unitOfMeasures, status } = useTanstackQuery({
    ...convexQuery(api.unitofmeasures.findAllByCompanyId, { companyId }),
    enabled: Boolean(companyId),
  })

  if (status === "pending") return <LoadingSpinner />
  return (
    <>
      <section className="text-right">
        <CreateUom />
      </section>
      {status === "success" && !!unitOfMeasures?.length && (
        <Table>
          <TableCaption>A list of unit of measures.</TableCaption>
          <TableHeader>
            <TableRow className="capitalize">
              <TableHead>ID</TableHead>
              <TableHead>name</TableHead>
              <TableHead className="sr-only">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unitOfMeasures.map((uom) => (
              <TableRow key={uom._id}>
                <TableCell className="w-[100px] font-medium">
                  {uom._id.slice(-8, uom._id.length)}
                </TableCell>
                <TableCell className="font-medium capitalize">
                  {uom.name}
                </TableCell>
                <TableCell className="w-[100px] font-medium capitalize">
                  <UpdateUom id={uom._id} name={uom.name} />
                </TableCell>
                <TableCell className="w-[100px] font-medium capitalize">
                  <DeleteUom id={uom._id} name={uom.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}
