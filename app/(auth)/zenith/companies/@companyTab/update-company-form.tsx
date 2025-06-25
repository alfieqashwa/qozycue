import { SubmitButton } from "@/components/submit-button"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SheetClose, SheetFooter } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { countries } from "@/lib/countries"
import { cn } from "@/lib/utils"
import { Subscription } from "@/types"
import {
  updateCompanyZenithSchema,
  type TUpdateCompanyZenith,
} from "@/types/schema/company-schema"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useMutation,
  useQuery as useTanstackQuery,
} from "@tanstack/react-query"
import { ConvexError } from "convex/values"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export function UpdateCompanyForm({
  id,
  name,
  phone,
  location,
  countryCode,
  subscription,
  setOpen,
}: {
  id: Id<"companies">
  name: string
  phone: string
  location: string
  countryCode: string
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
      countryCode,
      location,
      subscription,
    },
  })

  const { data: hasCompanyName, status: hasCompanyNameStatus } =
    useTanstackQuery({
      ...convexQuery(api.companies.findAll, {}),
      select: (data) =>
        data
          .filter((c) => c._id !== id)
          .some((c) => c.name === form.watch("name").toLowerCase()),
    })

  // 2. Define a submit handler.
  function onSubmit(values: TUpdateCompanyZenith) {
    const { name, phone, location, subscription, countryCode } = values

    mutate({
      updateCompanyZenithSchema: {
        id,
        name: name.toLowerCase(),
        phone: phone.trim(),
        location: location.toLowerCase(),
        countryCode,
        subscription,
      },
    })
  }
  // TODO: configure `hasCompanyName` as like as createTrialCompany to make sure the companyName has unique name.
  return (
    <ScrollArea className="h-[calc(100vh_-_9rem)] lg:px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Name */}
          {hasCompanyNameStatus === "success" && (
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
                      className="capitalize"
                    />
                  </FormControl>
                  <p className="text-destructive text-sm">
                    {hasCompanyName &&
                      "Duplicate name! Please add another name."}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
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
            name="countryCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-[280px]">
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries?.map((c, i) => (
                      <SelectItem value={c.code} key={`${c.code}-${i}`}>
                        <Image
                          src={c.flag}
                          alt={c.country}
                          width={300}
                          height={150}
                          className="flex h-4 w-6 items-center"
                        />
                        <span className="font-medium">{c.country}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
          <SheetFooter className="flex flex-col-reverse md:flex-row md:justify-end md:space-x-2">
            <SheetClose className={cn(buttonVariants({ variant: "outline" }))}>
              Cancel
            </SheetClose>
            <SubmitButton
              title="Update Company"
              isPending={isPending}
              disabled={hasCompanyName}
            />
          </SheetFooter>
        </form>
      </Form>
    </ScrollArea>
  )
}
