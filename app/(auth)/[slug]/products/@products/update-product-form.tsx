import { zodResolver } from "@hookform/resolvers/zod"
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
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/trpc/react"
import { productSchema, type TProduct } from "@/types/schema/product-schema"

export function UpdateProductForm({
  id,
  name,
  costPrice,
  salePrice,
  categoryId,
  unitOfMeasureId,
  setOpen,
}: {
  id: string
  name: string
  costPrice: number
  salePrice: number
  categoryId: string
  unitOfMeasureId: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const router = useRouter()
  const { toast } = useToast()

  const uoms = api.unitOfMeasure.findAllByCompanyId.useQuery(undefined, {
    select(data) {
      return data.filter((d) => d.name !== "minute" && d.name !== "hour")
    },
  })

  const categories = api.category.findAll.useQuery()

  const { mutate, isPending } = api.product.update.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your product has been updated.",
      })
      /* auto-closed after succeed submit the dialog form */
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

  // 1. Define form.
  const form = useForm<TProduct>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id,
      name,
      costPrice,
      salePrice,
      categoryId,
      unitOfMeasureId,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: TProduct) {
    const { id, name, costPrice, salePrice, categoryId, unitOfMeasureId } =
      values

    mutate({
      id,
      name: name.toLowerCase(),
      costPrice,
      salePrice,
      categoryId,
      unitOfMeasureId,
    })
  }

  // disabled submitting whenever costPrice is greater than or equal to salePrice
  const disabled = form.watch("costPrice") >= form.watch("salePrice")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <div className="px-4 pt-4 md:absolute md:bottom-4 md:right-4 md:px-0 md:pt-0">
          {isPending ? (
            <Button disabled className="w-full md:w-auto">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              disabled={isPending || disabled}
              type="submit"
              className="w-full md:w-auto"
            >
              Update Product
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
