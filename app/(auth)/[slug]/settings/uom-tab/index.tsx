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
import { CreateUom } from "./create-uom"
import { DeleteUom } from "./delete-uom"
import { UpdateUom } from "./update-uom"

export function UoMTab({
  disabledBasedOnAccessLevel,
}: {
  disabledBasedOnAccessLevel: boolean
}) {
  const { data: unitOfMeasures, status } =
    api.unitOfMeasure.findAllByCompanyId.useQuery()
  if (status === "pending") return <LoadingSpinner />
  return (
    <>
      <div className="text-right">
        <CreateUom disabledBasedOnAccessLevel={disabledBasedOnAccessLevel} />
      </div>
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
              <TableRow key={uom.id}>
                <TableCell className="w-[100px] font-medium">
                  {uom.id.slice(-8, uom.id.length)}
                </TableCell>
                <TableCell className="font-medium capitalize">
                  {uom.name}
                </TableCell>
                <TableCell className="w-[100px] font-medium capitalize">
                  <UpdateUom
                    id={uom.id}
                    name={uom.name}
                    disabledBasedOnAccessLevel={disabledBasedOnAccessLevel}
                  />
                </TableCell>
                <TableCell className="w-[100px] font-medium capitalize">
                  <DeleteUom
                    id={uom.id}
                    name={uom.name}
                    disabledBasedOnAccessLevel={disabledBasedOnAccessLevel}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}
