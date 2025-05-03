"use client"

import { useDateRange } from "@/app/hooks/useDateRange"
import { CustomDatePicker } from "@/components/custom-date-picker"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { countries } from "@/lib/countries"
import { convexQuery } from "@convex-dev/react-query"
import { useQueries as useTanstackQueries } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { PrintTransactionPdf } from "./print-transaction-pdf"

export default function DetailPage() {
  const [date, setDate] = useDateRange()

  const { from, to } = {
    from: date?.from?.getTime(),
    to: date?.to?.getTime(),
  }

  const [company, orders] = useTanstackQueries({
    queries: [
      convexQuery(api.companies.find, {}),
      {
        ...convexQuery(api.orders.printTransaction, { from, to }),
        enabled: !!date?.from && !!date.to,
      },
    ],
  })

  const contentRef = useRef<HTMLDivElement>(null)
  const handlePrintFn = useReactToPrint({
    contentRef: contentRef,
    onPrintError: () => alert("there is an error when printing"),
    // contentRef: () => componentRef,
    // onPrintError: () => alert("there is an error when printing"),
  })

  const country = countries.find(
    (c) => c.code === (company.data?.countryCode as string),
  )

  const isLoading = company.status !== "success" || orders.status !== "success"
  return (
    <div className="relative">
      <CustomDatePicker date={date} setDate={setDate} className="md:right-32" />
      <section className="absolute -top-14 right-0">
        {isLoading ? (
          <Button disabled>
            <Loader2 className="size-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button onClick={() => handlePrintFn()}>Download</Button>
        )}
      </section>

      {isLoading && <LoadingSpinner />}
      {company.status === "success" &&
        orders.status === "success" &&
        !!country && (
          <PrintTransactionPdf
            company={company.data}
            country={country}
            orders={orders.data}
            ref={contentRef}
          />
        )}
    </div>
  )
}
