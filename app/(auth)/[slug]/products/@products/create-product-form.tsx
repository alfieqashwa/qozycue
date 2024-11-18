import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
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
import {
  createProductSchema,
  type TCreateProduct,
} from "@/types/schema/product-schema"
import {
  useMutation,
  useQueries as useTanstackQueries,
} from "@tanstack/react-query"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { api } from "@/convex/_generated/api"
import { toast } from "sonner"
import { ConvexError } from "convex/values"
import { useMemo } from "react"

export function CreateProductForm({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [uoms, categories] = useTanstackQueries({
    queries: [
      convexQuery(api.unitOfMeasures.findAll, {}),
      convexQuery(api.categories.findAll, {}),
    ],
  })

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.products.create),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "Your product has been created.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
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

  function onSubmit(values: TCreateProduct) {
    const { name, costPrice, salePrice, unitOfMeasureId, categoryId } = values
    mutate({
      createProductSchema: {
        name: name.toLowerCase(),
        costPrice,
        salePrice,
        unitOfMeasureId,
        categoryId,
      },
    })
  }

  // disabled submitting whenever costPrice is greater than or equal to salePrice
  const disabledPriceComparison =
    Number(form.watch("costPrice")) >= Number(form.watch("salePrice"))
  const disabled =
    isPending ||
    disabledPriceComparison ||
    form.watch("unitOfMeasureId") === "" ||
    form.watch("categoryId") === ""
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
                <Input
                  type="number"
                  placeholder="cost price"
                  className="w-[200px]"
                  {...field}
                />
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
                <Input
                  type="number"
                  placeholder="sale price"
                  className="w-[200px]"
                  {...field}
                />
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
                <FormControl className="w-[200px] capitalize">
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
                          value={uom._id}
                          className="capitalize"
                          key={uom._id}
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
                <FormControl className="w-[200px] uppercase">
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
                          value={category._id}
                          className="uppercase"
                          key={category._id}
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
            <Button disabled={disabled} type="submit">
              Create Product
            </Button>
          )}
        </SheetFooter>
      </form>
    </Form>
  )
}
