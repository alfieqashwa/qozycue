import { useMediaQuery } from "@/app/hooks/use-media-query"
import { PrintReceipt } from "@/components/print-receipt"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { formattedPrice, formattedPriceWithRupiah } from "@/lib/format-price"
import { cn } from "@/lib/utils"
import {
  submitPaymentSchema,
  type TSubmitPayment,
} from "@/types/schema/payment-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQueries as useTanstackQueries,
} from "@tanstack/react-query"
import { FunctionReturnType } from "convex/server"
import { ConvexError } from "convex/values"
import { CircleHelp, Loader2, Printer } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useMemo, useRef, useState } from "react"
import { type Control, useForm, useWatch } from "react-hook-form"
import { useReactToPrint } from "react-to-print"
import { toast } from "sonner"
import { useDebouncedCallback } from "use-debounce"

export function PaymentForm({
  orderId,
  poolTableName,
  customerName,
  customerPhone,
  totalCost = 0,
  orderlines,
  defaultTax,
  setOpen,
}: {
  orderId: Id<"orders">
  poolTableName?: string
  customerName?: string
  customerPhone?: string | null
  totalCost?: number
  orderlines?: FunctionReturnType<typeof api.orderlines.findAllByOrderId>
  defaultTax: number | undefined
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const receiptRef = useRef(null)
  const billRef = useRef(null)
  const [changeMoney, setChangeMoney] = useState("")
  const router = useRouter()

  const form = useForm<TSubmitPayment>({
    resolver: zodResolver(submitPaymentSchema),
    defaultValues: {
      orderId,
      tax: defaultTax ?? 0,
      discount: 0,
      totalAmount: 0,
      revenue: 0,
      paymentMethod: "CASH",
      note: "",
    },
  })

  // const discounts = api.discount.findAllByCompanyId.useQuery()
  // const taxes = api.tax.findAllByCompanyId.useQuery()

  const [taxes, discounts] = useTanstackQueries({
    queries: [
      convexQuery(api.taxes.findAll, {}),
      convexQuery(api.discounts.findAll, {}),
    ],
  })

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.orders.payment),
    onSuccess() {
      setOpen(false)
      router.refresh()

      toast.success("Succeed!", {
        description: "Payment process is succeed.",
        action: (
          <>
            <div className="hidden">
              <PrintReceipt
                orderId={orderId}
                poolTableName={poolTableName}
                customerName={customerName}
                ref={receiptRef}
              />
            </div>
            <Button size="sm" onClick={handleReceiptPrint}>
              <Printer className="mr-2 size-4" />
              <span>Receipt</span>
            </Button>
          </>
        ),
        duration: 10000, // 10 secs
      })
    },
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
  })

  // STARTS PRINT THE PAYMENT CONFIGURATiON
  const handleReceiptPrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `receipt_order_${orderId?.slice(-8, orderId.length)}`,
    onPrintError: () => alert("There is an error when printing receipt."),
  })
  const handleBillPrint = useReactToPrint({
    content: () => billRef.current,
    documentTitle: `bill_order_${orderId?.slice(-8, orderId.length)}`,
    onPrintError: () => alert("There is an error when printing bill."),
  })
  // ENDS PRINT THE PAYMENT CONFIGURATiON

  const totalAmount = useMemo(() => {
    return orderlines?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0
  }, [orderlines])

  const getDiscountVal = useWatch({ control: form.control, name: "discount" })
  const getTaxVal = useWatch({ control: form.control, name: "tax" })
  const paymentMethod = useWatch({
    control: form.control,
    name: "paymentMethod",
  })

  const getTotal = useCallback(
    (subTotal: number, discount: number, tax: number) => {
      const discountedSubTotal = subTotal * discount
      const taxedSubTotal = subTotal * tax
      const discountAfterSubTotal = subTotal - discountedSubTotal
      const totalAmount = discountAfterSubTotal + taxedSubTotal
      return {
        totalAmount: Math.round(totalAmount / 100) * 100,
        revenue: Math.round(discountAfterSubTotal / 100) * 100,
      }
    },
    [],
  )

  /**
   * Wrapping 'fixedGrandTotal' with useMemo to prevent unnecessary re-renders.
   * This optimization is necessary because without it, 'fixedGrandTotal' would be recalculated
   * every time the user selects a payment method or enters an amount of money, which is inefficient.
   */
  const fixedGrandTotal = useMemo(
    () =>
      getTotal(
        totalCost + totalAmount,
        Number(getDiscountVal),
        Number(getTaxVal),
      ),
    [getTotal, totalCost, totalAmount, getDiscountVal, getTaxVal],
  )

  const formattedTotalCost = useMemo(
    () => formattedPrice.format(Number(totalCost)),
    [totalCost],
  )
  const formattedTotalOrder = useMemo(
    () => formattedPrice.format(Number(totalAmount)),
    [totalAmount],
  )
  const formattedSubTotal = useMemo(
    () => formattedPrice.format(Number(totalCost + totalAmount)), // subTotal = totalCost + totalAmount
    [totalAmount, totalCost],
  )
  const formattedFixedGrandTotal = useMemo(
    () => formattedPriceWithRupiah.format(Number(fixedGrandTotal.totalAmount)),
    [fixedGrandTotal.totalAmount],
  )

  /**
   * Calculates the change money based on the customer's payment and the fixed grand total.
   * Returns the formatted change money if it's non-negative, otherwise returns undefined.
   */
  /**
   * Calculates the change money based on the customer's payment and the fixed grand total.
   * Returns the formatted change money if it's non-negative, otherwise returns undefined.
   */
  const changeCustomerMoney = useCallback(
    (customerMoney: string) => {
      const changeMoney =
        parseFloat(customerMoney) - fixedGrandTotal.totalAmount
      return isNaN(changeMoney) || changeMoney < 0
        ? undefined
        : formattedPriceWithRupiah.format(changeMoney)
    },
    [fixedGrandTotal.totalAmount],
  )

  /**
   * Handles the customer's money input with debounce.
   * Updates the change money state after a 300ms delay.
   */
  /**
   * Handles the customer's money input with debounce.
   * Updates the change money state after a 300ms delay.
   */
  const handleCustomerMoney = useDebouncedCallback((term: string) => {
    setChangeMoney(term)
  }, 300)

  const onSubmit = (values: TSubmitPayment) => {
    const { orderId, discount, tax, paymentMethod, note } = values
    mutate({
      submitPaymentSchema: {
        orderId,
        discount,
        tax,
        paymentMethod,
        totalAmount: fixedGrandTotal.totalAmount,
        revenue: fixedGrandTotal.revenue,
        note,
      },
    })
  }

  return (
    <ScrollArea className="-mx-6 py-2 text-sm md:mt-4 md:min-h-[calc(100vh_-_6rem)] md:text-base">
      <div className="flex justify-center md:justify-end md:pb-2 md:pr-5">
        <div className="hidden">
          <PrintReceipt
            orderId={orderId}
            poolTableName={poolTableName}
            customerName={customerName}
            printStatus="bill"
            ref={billRef}
          />
        </div>
        <Button variant="secondary" size="sm" onClick={handleBillPrint}>
          <Printer className="mr-2 size-4" />
          <span>Bill</span>
        </Button>
      </div>
      <PaymentInformation
        customerName={customerName}
        customerPhone={customerPhone}
        formattedTotalCost={formattedTotalCost}
        formattedTotalOrder={formattedTotalOrder}
        formattedSubTotal={formattedSubTotal}
        formattedFixedGrandTotal={formattedFixedGrandTotal}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 px-6 py-1"
        >
          {/* Tax */}
          <PaymentFormField
            control={form.control}
            name="tax"
            data={taxes.data}
            status={taxes.status}
            defaultValue={defaultTax}
          />
          {/* Discount */}
          <PaymentFormField
            control={form.control}
            name="discount"
            data={discounts.data}
            status={discounts.status}
          />
          {/* Payment Method */}
          <PaymentFormField control={form.control} name="paymentMethod" />

          {paymentMethod === "CASH" ? (
            <section className="py-4">
              <Input
                type="number"
                placeholder="input uang dari customer"
                onChange={(e) => handleCustomerMoney(e.target.value)}
              />
              <article className="grid grid-cols-2 gap-x-2 py-4 text-sm font-medium text-muted-foreground">
                <p className="text-right">Diterima:</p>
                <p>{formattedPriceWithRupiah.format(Number(changeMoney))}</p>
                <p className="text-right">Kembalian:</p>
                <p className="text-primary">
                  {changeCustomerMoney(changeMoney)}
                </p>
              </article>
            </section>
          ) : (
            // Note
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize text-muted-foreground">
                    Note
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Catatan sebagai referensi... (optional)"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <footer className="flex flex-col-reverse md:absolute md:bottom-4 md:right-6 md:flex-row md:justify-end md:space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              className="mt-1.5 sm:mt-0"
            >
              Cancel
            </Button>
            {isPending ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin disabled:pointer-events-auto disabled:cursor-not-allowed" />
                Please wait
              </Button>
            ) : (
              <Button
                disabled={isPending}
                type="submit"
                className="disabled:pointer-events-auto disabled:cursor-not-allowed"
              >
                Make Payment
              </Button>
            )}
          </footer>
        </form>
      </Form>
    </ScrollArea>
  )
}

const PaymentInformation = ({
  customerName,
  customerPhone,
  formattedTotalCost,
  formattedTotalOrder,
  formattedSubTotal,
  formattedFixedGrandTotal,
}: {
  customerName?: string
  customerPhone?: string | null
  formattedTotalCost: string
  formattedTotalOrder: string
  formattedSubTotal: string
  formattedFixedGrandTotal: string
}) => (
  <section className="px-6">
    <InfoRow label="customer name:" value={customerName ? customerName : "-"} />
    <InfoRow
      label="customer phone:"
      value={customerPhone ? customerPhone : "-"}
    />
    <InfoRow label="total rental:" value={formattedTotalCost} />
    <InfoRow label="total order:" value={formattedTotalOrder} />
    <InfoRow label="sub total:" value={formattedSubTotal} />
    <InfoRow
      label="grand total:"
      value={formattedFixedGrandTotal}
      className="font-semibold text-primary"
    />
  </section>
)

const InfoRow = ({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) => (
  <>
    <div className="flex items-center justify-between py-1 capitalize">
      <p className="text-muted-foreground">{label}</p>
      <p className={cn(className)}>{value}</p>
    </div>
    <Separator className="my-1" />
  </>
)

interface PaymentFormValue {
  orderId: Id<"orders">
  discount: number
  tax: number
  paymentMethod: "CASH" | "DEBIT" | "CREDIT"
  totalAmount: number
  revenue: number
}

type PaymentFormFieldProps = {
  control: Control<PaymentFormValue>
  name: keyof PaymentFormValue
  data?: Array<{
    _id: Id<"taxes"> | Id<"discounts">
    name: string
    value: number
    companyId: Id<"companies">
  }>
  status?: "success" | "pending" | "error"
  defaultValue?: number
}

const PaymentFormField = ({
  control,
  name,
  data,
  status,
  defaultValue,
}: PaymentFormFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <div className="flex items-center justify-between">
          {defaultValue ? (
            <DefaultTaxTooltip defaultValue={defaultValue} name={name} />
          ) : (
            <FormLabel className="capitalize text-muted-foreground">
              {name}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value as string}
            value={field.value as string}
          >
            <FormControl>
              <SelectTrigger className="w-[160px]">
                <SelectValue
                  placeholder={`Select ${name}`}
                  className="placeholder:capitalize"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {!!status && !!data ? (
                <SelectGroup>
                  {status === "success" &&
                    data?.map((item, i) => (
                      <SelectItem value={item.value.toString()} key={i}>
                        {item.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              ) : (
                <SelectGroup>
                  {["CASH", "DEBIT", "CREDIT"].map((paymentMethod, i) => (
                    <SelectItem value={paymentMethod} key={i}>
                      {paymentMethod}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
)

const DefaultTaxTooltip = ({
  defaultValue,
  name,
}: {
  defaultValue: number
  name: keyof PaymentFormValue
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  return (
    <div className="relative">
      {isDesktop ? (
        <Tooltip>
          <TooltipTrigger
            asChild
            className="absolute -right-3.5 -top-1 hover:cursor-help"
          >
            <CircleHelp
              size={15}
              className="animate-pulse-slow text-amber-300"
            />
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-muted text-xs tracking-wider text-amber-300"
          >
            Default Tax {defaultValue * 100}%
          </TooltipContent>
        </Tooltip>
      ) : (
        <Popover>
          <PopoverTrigger
            asChild
            className="absolute -right-4 -top-1 hover:cursor-help"
          >
            <CircleHelp
              size={15}
              className="animate-pulse-slow text-amber-300"
            />
          </PopoverTrigger>
          <PopoverContent
            side="right"
            className="w-auto bg-muted py-1.5 text-xs tracking-wider text-amber-300"
          >
            Default Tax {defaultValue * 100}%
          </PopoverContent>
        </Popover>
      )}
      <FormLabel className="capitalize text-muted-foreground">{name}</FormLabel>
    </div>
  )
}
