import { Suspense } from "react"
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
import { CreateDiscount } from "./create-discount"
import { DeleteDiscount } from "./delete-discount"
import { UpdateDiscount } from "./update-discount"

export async function DiscountTab() {
  const discounts = await api.discount.findAllByCompanyId()
  return (
    <>
      <div className="text-right">
        <CreateDiscount />
      </div>
      <Suspense fallback={<LoadingSpinner />}>
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
            {discounts.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="w-[200px] font-medium">
                  {c.id.slice(-8, c.id.length)}
                </TableCell>
                <TableCell className="w-[200px] font-medium capitalize">
                  {c.name}
                </TableCell>
                <TableCell>{c.value}</TableCell>
                <TableCell className="w-[100px]">
                  <UpdateDiscount
                    id={c.id}
                    name={c.name}
                    value={c.value}
                    disabledBasedOnAccessLevel={disabledBasedOnAccessLevel}
                  />
                </TableCell>
                <TableCell className="w-[100px]">
                  <DeleteDiscount
                    id={c.id}
                    name={c.name}
                    disabledBasedOnAccessLevel={disabledBasedOnAccessLevel}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Suspense>
    </>
  )
}
