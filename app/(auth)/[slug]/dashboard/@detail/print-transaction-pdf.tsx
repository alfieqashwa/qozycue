"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { api } from "@/convex/_generated/api"
import { formattedPriceWithRupiah } from "@/lib/format-price"
import { FunctionReturnType } from "convex/server"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { MapPin, Phone } from "lucide-react"
import { forwardRef, type Ref } from "react"

export const PrintTransactionPdf = forwardRef(
  (
    {
      company,
      orders,
    }: {
      company: FunctionReturnType<typeof api.companies.find>
      orders: FunctionReturnType<typeof api.orders.printTransaction>
    },
    ref,
  ) => {
    return (
      <div
        ref={ref as Ref<HTMLDivElement> | undefined}
        className="bg-white px-4 pb-20 text-sm text-zinc-700"
      >
        <section className="py-4 text-center">
          <h2 className="text-lg capitalize">{company?.name}</h2>
          <article className="space-y-1">
            <p className="mt-2 flex items-center justify-center space-x-1 whitespace-nowrap text-xs">
              <Phone size={12} />
              <span>{company?.phone}</span>
            </p>
            <p className="flex items-center justify-center space-x-1 whitespace-nowrap text-xs capitalize">
              <MapPin size={12} />
              <span>{company?.location}</span>
            </p>
          </article>
        </section>
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-600">
              <TableHead className="text-center font-medium text-zinc-50">
                Date
              </TableHead>
              <TableHead className="w-[100px] whitespace-nowrap pl-4 font-medium text-foreground text-zinc-50">
                Order ID
              </TableHead>
              <TableHead className="whitespace-nowrap font-medium text-zinc-50">
                Created By
              </TableHead>
              <TableHead className="text-center font-medium text-zinc-50">
                Table
              </TableHead>
              <TableHead className="font-medium text-zinc-50">
                Customer
              </TableHead>
              <TableHead className="text-center font-medium text-zinc-50">
                Payment
              </TableHead>
              <TableHead className="text-right font-medium text-zinc-50">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.orderList.map((order) => (
              <TableRow key={order._id} className="odd:bg-zinc-200">
                <TableCell className="text-center text-xs">
                  {format(order._creationTime, "dd/MM/yyyy", { locale: id })}
                </TableCell>
                <TableCell className="pl-4 text-xs">
                  {order._id.slice(-8, order._id.length)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs capitalize">
                  {order.createdBy?.name}
                </TableCell>
                <TableCell className="whitespace-nowrap text-center text-xs">
                  {!order.poolRental?.poolTable?.name
                    ? "Cafe-Only"
                    : order.poolRental.poolTable.name}
                </TableCell>
                <TableCell className="whitespace-nowrap text-xs capitalize">
                  {order.customer.name === "anonymous"
                    ? "-"
                    : order.customer.name}
                </TableCell>
                <TableCell className="text-center text-xs">
                  {order.paymentMethod}
                </TableCell>
                <TableCell className="whitespace-nowrap text-right text-xs">
                  {formattedPriceWithRupiah.format(Number(order.totalAmount))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="absolute right-2 my-4 py-2 pr-4 text-right font-medium">
          <article className="grid grid-cols-2 gap-x-2">
            <p className="whitespace-nowrap text-right">Total Revenue:</p>
            <p>
              {formattedPriceWithRupiah.format(Number(orders.totalRevenue))}
            </p>
            <p className="text-right">Total:</p>
            <p className="whitespace-nowrap">
              {orders.totalTransaction}{" "}
              <span>
                {orders.totalTransaction === 1 ? "transaction" : "transactions"}
              </span>
            </p>
          </article>
        </div>
      </div>
    );
  },
)

//? source -> https://chatgpt.com/c/67371a5b-3118-8002-8897-64ddd5e71a95
PrintTransactionPdf.displayName = "PrintTransactionPdf"
