import { Suspense } from "react"
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
import { CreateTax } from "./create-tax"
import { DeleteTax } from "./delete-tax"
import { ToggleTax } from "./toggle-tax"
import { UpdateTax } from "./update-tax"

export async function TaxTab() {
  const taxes = await api.tax.findAllByCompanyId()
  const hasDefaultValueTax = taxes.some((x) => x.isDefaultValue)

  return (
    <>
      <div className="text-right">
        <CreateTax />
      </div>
      <Suspense fallback={<LoadingSpinner />}>
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
            {taxes.map((x) => (
              <TableRow key={x.id}>
                <TableCell className="w-[200px] font-medium">
                  {x.id.slice(-8, x.id.length)}
                </TableCell>
                <TableCell className="w-[200px] font-medium capitalize">
                  {x.name}
                </TableCell>
                <TableCell>{x.value}</TableCell>
                <TableCell>
                  <ToggleTax
                    id={x.id}
                    isDefaultValue={x.isDefaultValue}
                    hasDefaultValueTax={hasDefaultValueTax}
                  />
                </TableCell>
                <TableCell className="w-[100px]">
                  <UpdateTax
                    id={x.id}
                    name={x.name}
                    value={x.value}
                    disabledBasedOnAccessLevel={disabledBasedOnAccessLevel}
                  />
                </TableCell>
                <TableCell className="w-[100px]">
                  <DeleteTax
                    id={x.id}
                    name={x.name}
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
