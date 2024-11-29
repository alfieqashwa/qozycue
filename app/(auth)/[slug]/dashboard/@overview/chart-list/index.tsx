import { DateRange } from "react-day-picker"
import { RevenueByPaymentMethod } from "./revenue-by-payment-method"
import { RevenueByPoolTable } from "./revenue-by-pool-table"
import { RevenueByProductCategory } from "./revenue-by-product-category"
import RevenueByTopTenProducts from "./revenue-by-top-ten-products"

export function ChartList({ date }: { date: DateRange | undefined }) {
  const { from, to } = {
    from: date?.from?.getTime(),
    to: date?.to?.getTime(),
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <RevenueByPaymentMethod from={from} to={to} />
        <RevenueByProductCategory from={from} to={to} />
      </div>
      <RevenueByPoolTable from={from} to={to} />
      <RevenueByTopTenProducts from={from} to={to} />
    </>
  )
}
