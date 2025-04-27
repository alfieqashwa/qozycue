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
import { Id } from "@/convex/_generated/dataModel"
import { cn } from "@/lib/utils"
import {
  updateProductSchema,
  type TUpdateProduct,
} from "@/types/schema/product-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { CategoryFormLabel } from "../category-form-label"
import { SubmitButton } from "../submit-button"

type UpdateProductFormProps = {
  id: Id<"products">
  name: string
  costPrice: number
  salePrice: number
  categoryId: Id<"categories">
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export function UpdateProductForm({
  id,
  name,
  costPrice,
  salePrice,
  categoryId,
  setOpen,
}: UpdateProductFormProps) {
  const categories = useTanstackQuery({
    ...convexQuery(api.categories.findAll, {}),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.products.update),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "Your product has been updated.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  const form = useForm<TUpdateProduct>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      id,
      name,
      costPrice,
      salePrice,
      categoryId,
    },
  })

  const { data: hasProductName } = useTanstackQuery({
    ...convexQuery(api.products.findAll, {}),
    enabled: Boolean(id),
    select(data) {
      return data
        .filter((p) => p._id !== id)
        .some((product) => product.name === form.watch("name"))
    },
  })

  function onSubmit(values: TUpdateProduct) {
    const { id, name, costPrice, salePrice, categoryId } = values
    mutate({
      updateProductSchema: {
        id,
        name: name.toLowerCase(),
        costPrice,
        salePrice,
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
    <ScrollArea className="h-[calc(100vh_-_8.6rem)]">
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
                  <Input
                    placeholder="name"
                    {...field}
                    className="w-[280px] capitalize"
                  />
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
                              className="peer hidden" // hide radio button
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
          <SheetFooter className="mt-20 flex flex-col-reverse md:flex-row md:items-center md:justify-end md:gap-4">
            <SheetClose className={cn(buttonVariants({ variant: "outline" }))}>
              Cancel
            </SheetClose>
            <SubmitButton
              title="Update Product"
              isPending={isPending}
              disabled={disabled}
            />
          </SheetFooter>
        </form>
      </Form>
    </ScrollArea>
  )
}
