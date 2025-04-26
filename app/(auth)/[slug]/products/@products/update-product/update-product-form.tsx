import { Button, buttonVariants } from "@/components/ui/button"
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
import { Coffee, Loader2, ShoppingBasket, Soup } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

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

  const colorBasedOnCategory = (category: string) =>
    category === "food"
      ? "text-emerald-200"
      : category === "drink"
        ? "text-fuchsia-200"
        : "text-lime-200"

  const iconBasedOnCategory = (category: string) =>
    category === "food" ? (
      <Soup className="ml-1 size-6 text-emerald-200" />
    ) : category === "drink" ? (
      <Coffee className="ml-1 size-6 text-fuchsia-200" />
    ) : (
      <ShoppingBasket className="ml-1 size-6 text-lime-200" />
    )

  // disabled submitting whenever costPrice is greater than or equal to salePrice
  const disabled = form.watch("costPrice") >= form.watch("salePrice")

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
                          className={cn("mt-1 flex items-center")}
                          key={`${category}-${i}`}
                        >
                          <FormControl>
                            <RadioGroupItem value={category._id} />
                          </FormControl>
                          <FormLabel
                            className={cn(
                              "tracking-wider",
                              colorBasedOnCategory(category.name),
                            )}
                          >
                            {iconBasedOnCategory(category.name)}
                          </FormLabel>
                        </FormItem>
                      ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SheetFooter className="mt-20 flex flex-col-reverse md:flex-row md:items-center md:justify-end md:gap-4">
            <SheetClose
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
              )}
            >
              Cancel
            </SheetClose>
            <SubmitButton isPending={isPending} disabled={disabled} />
          </SheetFooter>
        </form>
      </Form>
    </ScrollArea>
  )
}
const SubmitButton = ({
  isPending,
  disabled,
}: {
  isPending: boolean
  disabled: boolean
}) => (
  <Button
    disabled={isPending || disabled}
    type="submit"
    size={"sm"}
    className="w-full disabled:pointer-events-auto disabled:cursor-not-allowed md:w-auto"
  >
    {isPending ? (
      <>
        <Loader2 className="size-4 animate-spin" />
        <span>Please wait</span>
      </>
    ) : (
      <span>Update</span>
    )}
  </Button>
)
