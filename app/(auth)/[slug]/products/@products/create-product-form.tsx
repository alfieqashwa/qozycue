import { zodResolver } from "@hookform/resolvers/zod"
import { type Subscription } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SheetFooter } from "@/components/ui/sheet"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { validateSubscriptionLimits } from "@/lib/validate-subscription-limits"
import { api } from "@/trpc/react"
import {
  createProductSchema,
  type TCreateProduct,
} from "@/types/schema/product-schema"

export function CreateProductForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const router = useRouter()
  const utils = api.useUtils()
  const { toast } = useToast()

  const uoms = api.unitOfMeasure.findAll.useQuery()
  const categories = api.category.findAll.useQuery()
  const subscriptions = api.company.subscriptions.useQuery()

  const { mutate, isPending } = api.product.create.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your product has been created.",
      })
      await utils.company.subscriptions.invalidate()
      router.refresh()
      setOpen(false)
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

  const form = useForm<TCreateProduct>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      costPrice: 0,
      salePrice: 0,
      unitOfMeasureId: "",
      categoryId: "",
    },
  })

  const isValid = validateSubscriptionLimits({
    status: subscriptions.status,
    subscription: subscriptions.data?.subscription as Subscription,
    productLen: subscriptions.data?._count.products,
  })

  // Custom validation rule to check if sale price is less than cost price
  function onSubmit(values: TCreateProduct) {
    const { name, costPrice, salePrice, unitOfMeasureId, categoryId } = values

    if (!isValid) {
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Max product limit exceeded",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
    mutate({
      name: name.toLowerCase(),
      costPrice,
      salePrice,
      unitOfMeasureId,
      categoryId,
    })
  }

  // disabled submitting whenever costPrice is greater than or equal to salePrice
  const disabledPriceComparison =
    Number(form.watch("costPrice")) >= Number(form.watch("salePrice"))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} className="capitalize" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Cost Price */}
        <FormField
          control={form.control}
          name="costPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="cost price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Sale Price */}
        <FormField
          control={form.control}
          name="salePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sale Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="sale price" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Unit of Measure */}
        <FormField
          control={form.control}
          name="unitOfMeasureId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit of Measure</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="capitalize">
                  <SelectTrigger>
                    <SelectValue placeholder="Select UoM" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {uoms.status === "success" &&
                      !!uoms.data.length &&
                      uoms.data.map((uom) => (
                        <SelectItem
                          value={uom.id}
                          className="capitalize"
                          key={uom.id}
                        >
                          {uom.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="uppercase">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {categories.status === "success" &&
                      !!categories.data.length &&
                      categories.data.map((category) => (
                        <SelectItem
                          value={category.id}
                          className="uppercase"
                          key={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <SheetFooter className="absolute bottom-4 left-0 right-0 px-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="mt-1.5 sm:mt-0"
          >
            Cancel
          </Button>
          {isPending ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              disabled={isPending || disabledPriceComparison}
              type="submit"
            >
              Create Product
            </Button>
          )}
        </SheetFooter>
      </form>
    </Form>
  )
}
