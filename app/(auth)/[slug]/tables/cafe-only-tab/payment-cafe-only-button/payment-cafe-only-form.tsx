import { zodResolver } from "@hookform/resolvers/zod"
import { PaymentMethod } from "@prisma/client"
import { CircleHelp, Loader2, Printer } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useMemo, useRef, useState } from "react"
import { type Control, useForm } from "react-hook-form"
import { useReactToPrint } from "react-to-print"
import { useDebouncedCallback } from "use-debounce"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { ScrollArea } from "~/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Separator } from "~/components/ui/separator"
import { Textarea } from "~/components/ui/textarea"
import { ToastAction } from "~/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { useToast } from "~/components/ui/use-toast"
import { formattedPrice, formattedPriceWithRupiah } from "~/lib/format-price"
import { type IOrderline } from "~/lib/types"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"
import {
  submitPaymentCafeOnlySchema,
  type TSubmitPaymentCafeOnly,
} from "~/types/schema/payment-schema"
import { PrintReceipt } from "../../../_components/print-receipt"

export function PaymentCafeOnlyForm({
  orderId,
  customerName,
  customerPhone,
  orderlines,
  defaultTax,
  setOpen,
}: {
  orderId: string
  customerName?: string
  customerPhone?: string | null
  orderlines?: NonNullable<IOrderline[]>
  defaultTax: number | undefined
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const receiptRef = useRef(null)
  const billRef = useRef(null)
  const router = useRouter()
  const utils = api.useUtils()
  const { toast } = useToast()
  const [changeMoney, setChangeMoney] = useState("")

  const form = useForm<TSubmitPaymentCafeOnly>({
    resolver: zodResolver(submitPaymentCafeOnlySchema),
    defaultValues: {
      orderId,
      tax: defaultTax ?? 0,
      discount: 0,
      totalAmount: 0,
      revenue: 0,
      paymentMethod: PaymentMethod.CASH,
      note: "",
    },
  })

  const { mutate, isPending } = api.order.paymentCafeOnly.useMutation({
    async onSuccess() {
      await utils.order.invalidate()
      setOpen(false)
      router.refresh()

      toast({
        title: "Succeed!",
        variant: "default",
        description: "Payment process is succeed.",
        action: (
          <>
            <div className="hidden">
              <PrintReceipt
                orderId={orderId}
                customerName={customerName}
                ref={receiptRef}
              />
            </div>
            <Button onClick={handleReceiptPrint}>
              <Printer className="mr-2 size-4" />
              <span>Receipt</span>
            </Button>
          </>
        ),
        duration: 10000, // 10 secs
      })
    },
    onError(err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: err.message || "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    },
  })

  // STARTS PRINT THE PAYMENT CONFIGURATiON
  const handleReceiptPrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `receipt_order_${orderId.slice(-8, orderId.length)}`,
    onPrintError: () => alert("there is an error when printing receipt."),
  })
  const handleBillPrint = useReactToPrint({
    content: () => billRef.current,
    documentTitle: `bill_order_${orderId.slice(-8, orderId.length)}`,
    onPrintError: () => alert("there is an error when printing bill."),
  })
  // ENDS PRINT THE PAYMENT CONFIGURATiON

  const totalAmount = useMemo(
    () => orderlines?.reduce((acc, curr) => acc + curr.amount, 0) ?? 0,
    [orderlines],
  )

  const getDiscountVal = form.watch("discount")
  const getTaxVal = form.watch("tax")
  const paymentMethod = form.watch("paymentMethod")

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
    () => getTotal(totalAmount, Number(getDiscountVal), Number(getTaxVal)),
    [totalAmount, getDiscountVal, getTaxVal, getTotal],
  )

  const formattedTotalOrder = useMemo(
    () => formattedPrice.format(Number(totalAmount)),
    [totalAmount],
  )
  const formattedSubTotal = useMemo(
    () => formattedPrice.format(Number(totalAmount)),
    [totalAmount],
  )

  const formattedFixedGrandTotal = useMemo(
    () => formattedPriceWithRupiah.format(Number(fixedGrandTotal.totalAmount)),
    [fixedGrandTotal.totalAmount],
  )

  const taxes = api.tax.findAllByCompanyId.useQuery()
  const discounts = api.discount.findAllByCompanyId.useQuery()

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
      const changeMoney = Number(customerMoney) - fixedGrandTotal.totalAmount
      return isNaN(changeMoney) || changeMoney < 0
        ? undefined
        : formattedPriceWithRupiah.format(changeMoney)
    },
    [fixedGrandTotal],
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

  function onSubmit(values: TSubmitPaymentCafeOnly) {
    const { orderId, tax, discount, paymentMethod, note } = values

    mutate({
      orderId,
      tax,
      discount,
      paymentMethod,
      totalAmount: fixedGrandTotal.totalAmount,
      revenue: fixedGrandTotal.revenue,
      note,
    })
  }

  return (
    <ScrollArea className="-mx-6 py-4 text-sm md:h-[calc(100vh_-_5rem)] md:text-base">
      <div className="flex justify-center md:justify-end md:pb-2 md:pr-5">
        <div className="hidden">
          <PrintReceipt
            orderId={orderId}
            customerName={customerName}
            ref={billRef}
            printStatus="bill"
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
                placeholder="input uang customer"
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
                      placeholder="Catatan... (optional)"
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
  formattedTotalOrder,
  formattedSubTotal,
  formattedFixedGrandTotal,
}: {
  customerName?: string
  customerPhone?: string | null
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
  discount: number
  tax: number
  paymentMethod: PaymentMethod
  orderId: string
  totalAmount: number
  revenue: number
}

type PaymentFormFieldProp = {
  control: Control<PaymentFormValue>
  name: keyof PaymentFormValue
  data?: Array<{
    id: string
    name: string
    value: number
    companyId: string | null
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
}: PaymentFormFieldProp) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <div className="flex items-center justify-between">
          {defaultValue ? (
            <div className="relative">
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
                <TooltipContent side="right" className="bg-muted">
                  <p className="text-xs tracking-wider text-amber-300">
                    default tax {defaultValue * 100}%
                  </p>
                </TooltipContent>
              </Tooltip>
              <FormLabel className="capitalize text-muted-foreground">
                {name}
              </FormLabel>
            </div>
          ) : (
            <FormLabel className="capitalize text-muted-foreground">
              {name}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value as string} // Cast to the expected type
            value={field.value as string} // Cast to the expected type
          >
            <FormControl>
              <SelectTrigger className="w-[160px]">
                <SelectValue
                  placeholder={`Select ${name}`}
                  className="capitalize"
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
                  <SelectItem value={PaymentMethod.CASH}>
                    {PaymentMethod.CASH}
                  </SelectItem>
                  <SelectItem value={PaymentMethod.DEBIT}>
                    {PaymentMethod.DEBIT}
                  </SelectItem>
                  <SelectItem value={PaymentMethod.CREDIT}>
                    {PaymentMethod.CREDIT}
                  </SelectItem>
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
