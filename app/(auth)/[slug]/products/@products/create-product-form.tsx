import { buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SheetClose, SheetFooter } from "@/components/ui/sheet"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import {
  createProductSchema,
  type TCreateProduct,
} from "@/types/schema/product-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQueries as useTanstackQueries,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { CategoryFormLabel } from "./category-form-label"
import { SubmitButton } from "./submit-button"

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

  const { data: hasProductName } = useTanstackQuery({
    ...convexQuery(api.products.findAll, {}),
    select(data) {
      return data.some(
        (product) => product.name === form.watch("name").toLowerCase(),
      )
    },
  })

  function onSubmit(values: TCreateProduct) {
    const { name, costPrice, salePrice, categoryId } = values
    const defaultUomId = uoms?.data?.[0]._id
    mutate({
      createProductSchema: {
        name: name.toLowerCase(),
        costPrice,
        salePrice,
        unitOfMeasureId: defaultUomId,
        categoryId,
      },
    })
  }

  // disabled submitting whenever costPrice is greater than or equal to salePrice
  const disabledPriceComparison =
    Number(form.watch("costPrice")) >= Number(form.watch("salePrice"))
  const disabled =
    hasProductName || disabledPriceComparison || form.watch("categoryId") === ""
  return (
    <ScrollArea className="h-[calc(100vh_-_7.5rem)]">
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
          {/* Category */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl className="w-[200px] uppercase">
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row items-center space-x-6"
                  >
                    {categories.status === "success" &&
                      categories.data &&
                      categories.data.map((category, i) => (
                        <FormItem
                          className="mt-1 ml-1 flex items-center"
                          key={`${category}-${i}`}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={category._id}
                              className="peer hidden" //hide radio button
                            />
                          </FormControl>
                          <CategoryFormLabel categoryName={category.name} />
                        </FormItem>
                      ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SheetFooter className="mt-24 flex flex-col-reverse md:flex-row md:justify-end md:gap-4">
            <SheetClose className={cn(buttonVariants({ variant: "outline" }))}>
              Cancel
            </SheetClose>
            <SubmitButton
              title="Create Product"
              isPending={isPending}
              disabled={disabled}
            />
          </SheetFooter>
        </form>
      </Form>
    </ScrollArea>
  )
}
