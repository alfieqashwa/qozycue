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
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import {
  updateProductSchema,
  type TUpdateProduct,
} from "@/types/schema/product-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQueries as useTanstackQueries,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function UpdateProductForm({
  id,
  name,
  costPrice,
  salePrice,
  categoryId,
  unitOfMeasureId,
  setOpen,
}: {
  id: Id<"products">
  name: string
  costPrice: number
  salePrice: number
  categoryId: Id<"categories">
  unitOfMeasureId: Id<"unitOfMeasures">
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [uoms, categories] = useTanstackQueries({
    queries: [
      convexQuery(api.unitofmeasures.findAll, {}),
      convexQuery(api.categories.findAll, {}),
    ],
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
      unitOfMeasureId,
    },
  })
  function onSubmit(values: TUpdateProduct) {
    const { id, name, costPrice, salePrice, categoryId, unitOfMeasureId } =
      values
    mutate({
      updateProductSchema: {
        id,
        name: name.toLowerCase(),
        costPrice,
        salePrice,
        categoryId,
        unitOfMeasureId,
      },
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
