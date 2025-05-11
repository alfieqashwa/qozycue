import { type ListProps } from "../page"
import { RevenueByPaymentMethod } from "./revenue-by-payment-method"
import { RevenueByPoolTable } from "./revenue-by-pool-table"
import { RevenueByProductCategory } from "./revenue-by-product-category"
import RevenueByTopTenProducts from "./revenue-by-top-ten-products"

export function ChartList({ date, country }: ListProps) {
  const { from, to } = {
    from: date?.from?.getTime(),
    to: date?.to?.getTime(),
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <RevenueByPaymentMethod from={from} to={to} country={country} />
        <RevenueByProductCategory from={from} to={to} country={country} />
      </div>
      <RevenueByPoolTable from={from} to={to} country={country} />
      <RevenueByTopTenProducts from={from} to={to} country={country} />
    </>
  )
}
