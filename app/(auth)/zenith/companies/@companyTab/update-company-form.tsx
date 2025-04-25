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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SheetFooter } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Subscription } from "@/types"
import {
  updateCompanyZenithSchema,
  type TUpdateCompanyZenith,
} from "@/types/schema/company-schema"
import { useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function UpdateCompanyForm({
  id,
  name,
  phone,
  location,
  subscription,
  setOpen,
}: {
  id: Id<"companies">
  name: string
  phone: string
  location: string
  subscription: Subscription
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.companies.update),
    onSuccess: () =>
      toast.success("Succeed!", {
        description: "The company has been updated.",
      }),
    onError: (err) =>
      toast.error("Something went wrong.", {
        description:
          err instanceof ConvexError ? err.data : "Unexpected error occurred",
      }),
    onSettled: () => setOpen(false),
  })

  // 1. Define form.
  const form = useForm<TUpdateCompanyZenith>({
    resolver: zodResolver(updateCompanyZenithSchema),
    defaultValues: {
      id,
      name,
      phone,
      location,
      subscription,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: TUpdateCompanyZenith) {
    const { name, phone, location, subscription } = values

    mutate({
      updateCompanyZenithSchema: {
        id,
        name: name.toLowerCase(),
        phone: phone.trim(),
        location: location.toLowerCase(),
        subscription,
      },
    })
  }

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
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="location"
                  className="min-h-20 capitalize"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subscription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subscription" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["TRIAL", "BASIC", "PRO", "ENTERPRISE"].map((subs, i) => (
                    <SelectItem value={subs} key={i}>
                      {subs}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <SheetFooter className="absolute right-0 bottom-4 left-0 px-6">
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
              <Loader2 className="size-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button disabled={isPending} type="submit">
              Update Company
            </Button>
          )}
        </SheetFooter>
      </form>
    </Form>
  )
}
